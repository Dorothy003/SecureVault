from curses.ascii import HT
import os
import base64
import stat
from cairo import Status
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File as FastAPIFile,Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sentry_sdk import HttpTransport
from sqlalchemy.orm import Session
from streamlit import user
from sympy import det
from database import engine, get_db
from models import Base, User, File as  FileModel,FileKey
from schemas import RegisterIn, LoginIn, UserOut
from auth.auth import (
    hash_password, verify_password, create_access_token, get_current_user, require_role
)
from fastapi import Body

from crypto import (
    encrypt_private_key, decrypt_private_key,
    aesgcm_encrypt, aesgcm_decrypt,
    rsa_encrypt, rsa_decrypt,
    sha256_hex, generate_rsa_keypair
)

def b64e(data: bytes) -> str:
    return base64.b64encode(data).decode("utf-8")

def b64d(text: str) -> bytes:
    return base64.b64decode(text.encode("utf-8"))

app = FastAPI(title="secure file System")
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _get_current_user(token=Depends(__import__("fastapi").security.OAuth2PasswordBearer(tokenUrl="/auth/login")), db: Session = Depends(get_db)):
    from auth.auth import decode_token
    payload = decode_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="User not found")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def role_required(*roles: str):
    def dep(user: User = Depends(_get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="insufficient permissions")
        return user
    return dep

@app.post("/auth/register", response_model=UserOut, status_code=201)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already Registered")
    hashed_pw = hash_password(payload.password)
    priv_pem, pub_pem = generate_rsa_keypair()
    salt, nonce, cipher = encrypt_private_key(priv_pem, payload.password)
    user = User(
        email=payload.email,
        hash_password=hashed_pw,
        role=payload.role or "user",
        public_key_pem=pub_pem,
        enc_priv_salt=salt,
        enc_priv_nonce=nonce,
        enc_priv_cipher=cipher
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hash_password):
        raise HTTPException(status_code=401, detail="Invalid credential")
    token = create_access_token(subject=user.email, role=user.role)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=UserOut)
def me(current_user: User = Depends(_get_current_user)):
    return current_user

def get_current_user_db(db: Session = Depends(get_db), token: str = Depends(__import__("fastapi").security.OAuth2PasswordBearer(tokenUrl="/auth/login"))):
    from auth.auth import decode_token
    payload = decode_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
from fastapi import Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from fastapi import HTTPException

@app.post("/upload")
def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
    
    data = file.file.read()
    if data is None:
        raise HTTPException(status_code=400, detail="Empty file")

   
    aes_key = os.urandom(32)
    nonce, ciphertext = aesgcm_encrypt(aes_key, data)  

   
    file_hash = sha256_hex(data)

    UPLOAD_DIR = "uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    random_suffix = int.from_bytes(os.urandom(4), "big")
    storage_name = f"{current_user.id}_{random_suffix}_{file.filename}"
    storage_path = os.path.join(UPLOAD_DIR, storage_name)
    with open(storage_path, "wb") as fh:
        fh.write(nonce + ciphertext)

    fmodel = FileModel(
        owner_id=current_user.id,
        filename=file.filename,
        storage_path=storage_path,
        sha256=file_hash
    )
    db.add(fmodel)
    db.commit()
    db.refresh(fmodel)

    
    enc_aes_key = rsa_encrypt(current_user.public_key_pem, aes_key)  
    fk = FileKey(file_id=fmodel.id, user_id=current_user.id, enc_key=enc_aes_key)
    db.add(fk)
    db.commit()

    return {"file_id": fmodel.id, "filename": fmodel.filename, "sha256": fmodel.sha256}


@app.post("/download")
def download_file(
    file_id: int = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
  
    f = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="File not found")

    print(f"DEBUG: File metadata - ID: {f.id}, filename: {f.filename}, stored SHA256: {f.sha256}")
    print(f"DEBUG: Storage path: {f.storage_path}")


    fk = db.query(FileKey).filter(FileKey.file_id == file_id, FileKey.user_id == current_user.id).first()
    if not fk:
        raise HTTPException(status_code=403, detail="Not authorised to access this file")

    print(f"DEBUG: Found FileKey - ID: {fk.id}, encrypted key length: {len(fk.enc_key)}")

  
    try:
        priv_pem = decrypt_private_key(
            salt=current_user.enc_priv_salt,
            nonce=current_user.enc_priv_nonce,
            cipher=current_user.enc_priv_cipher,
            password=password
        )
        print("DEBUG: Successfully decrypted user's private key")
    except Exception as e:
        print(f"DEBUG: Failed to decrypt private key: {str(e)}")
        raise HTTPException(status_code=400, detail="Wrong password or corrupt private key")

    try:
        aes_key = rsa_decrypt(priv_pem, fk.enc_key)
        print(f"DEBUG: Successfully unwrapped AES key, length: {len(aes_key)} bytes")
    except Exception as exc:
        print(f"DEBUG: Failed to unwrap AES key: {str(exc)}")
        raise HTTPException(status_code=500, detail=f"Failed to unwrap AES key: {str(exc)}")

    if not isinstance(aes_key, (bytes, bytearray)) or len(aes_key) not in (16, 24, 32):
        print(f"DEBUG: Invalid AES key - type: {type(aes_key)}, length: {len(aes_key) if hasattr(aes_key, '__len__') else 'N/A'}")
        raise HTTPException(status_code=500, detail="Invalid AES key size after unwrap")

 
    try:
        with open(f.storage_path, "rb") as fh:
            raw = fh.read()
        print(f"DEBUG: Read encrypted file, total size: {len(raw)} bytes")
    except FileNotFoundError:
        print(f"DEBUG: File not found at path: {f.storage_path}")
        raise HTTPException(status_code=500, detail="Encrypted file missing on server")

    if len(raw) < 13:
        print(f"DEBUG: File too small: {len(raw)} bytes")
        raise HTTPException(status_code=500, detail="Stored file data too small / corrupted")

    nonce = raw[:12]
    ciphertext = raw[12:]
    print(f"DEBUG: Extracted nonce ({len(nonce)} bytes) and ciphertext ({len(ciphertext)} bytes)")

   
    try:
        plaintext = aesgcm_decrypt(aes_key, nonce, ciphertext)
        print(f"DEBUG: Successfully decrypted, plaintext size: {len(plaintext)} bytes")
    except Exception as exc:
        print(f"DEBUG: AES decryption failed: {str(exc)}")
        raise HTTPException(status_code=500, detail=f"AES decryption failed: {str(exc)}")

    calculated_hash = sha256_hex(plaintext)
    stored_hash = f.sha256
    
    print(f"DEBUG: Hash comparison:")
    print(f"  Stored hash:     {stored_hash}")
    print(f"  Calculated hash: {calculated_hash}")
    print(f"  Match: {calculated_hash == stored_hash}")
    
   
    preview = plaintext[:50] if len(plaintext) >= 50 else plaintext
    print(f"DEBUG: First {len(preview)} bytes of decrypted data: {preview.hex()}")
    
    if calculated_hash != stored_hash:

        print("DEBUG: Hash mismatch detected!")
        
        
        test_nonce, test_ciphertext = aesgcm_encrypt(aes_key, plaintext)
        test_decrypted = aesgcm_decrypt(aes_key, test_nonce, test_ciphertext)
        test_hash = sha256_hex(test_decrypted)
        
        print(f"DEBUG: Round-trip test:")
        print(f"  Original plaintext hash: {calculated_hash}")
        print(f"  Round-trip plaintext hash: {test_hash}")
        print(f"  Round-trip successful: {test_hash == calculated_hash}")
        
        raise HTTPException(status_code=500, detail=f"File integrity check failed - stored: {stored_hash}, calculated: {calculated_hash}")

    def iterfile():
        yield plaintext

    return StreamingResponse(
        iterfile(),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{f.filename}"'}
    )
@app.post("/share")
def share(
    file_id:int=Body(...),
    recipent_email:str=Body(...),
    owner_password:str=Body(...),
    db:Session =Depends(get_db),
    current_user:User=Depends(get_current_user_db)
):
    f=db.query(FileModel).filter(FileModel.id==file_id).first()
    if not f:
        raise HTTPException(status_code=404,detail="File not found")
    if f.owner_id !=current_user.id:
        raise HTTPException(status_code=403,detail="only owner can share this file")
    recipent=db.query(User).filter(User.email==recipent_email).first()
    if not recipent:
        raise HTTPException(status_code=404,detail="Reciepnt not found")
    fk_owner=db.query(FileKey).filter(FileKey.file_id==file_id,FileKey.user_id==current_user.id).first()
    if not fk_owner:
        raise HTTPException(status_code=500,detail="owner Aes missing")
    try:
        owner_priv_pem=decrypt_private_key(
            salt=current_user.enc_priv_salt,
            nonce=current_user.enc_priv_nonce,
            cipher=current_user.enc_priv_cipher,
            password=owner_password
        )    
    except Exception:
        raise HTTPException(status_code=400,detail="Failed to decrypt owner key")
    try:
        aes_key=rsa_decrypt(owner_priv_pem,fk_owner.enc_key)
    except Exception :
        raise HTTPException(status_code=500,detail="Failed to unwrap aes key")
    enc_key_for_recipient=rsa_encrypt(recipent.public_key_pem,aes_key)
    fk_recipient=FileKey(
        file_id=file_id,
        user_id=recipent.id,
        enc_key=enc_key_for_recipient
    )
    db.add(fk_recipient)
    db.commit()
    return {"detail":f"File is shared woth {recipent_email} successfully"}
@app.get("/health")
def health():
    return {"status": "Server is running"}
