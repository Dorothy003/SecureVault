import os
import base64
from cryptography.hazmat.primitives.asymmetric import rsa,padding
from cryptography.hazmat.primitives import serialization,hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend

Backend=default_backend()
RSA_BITS=3072

def generate_rsa_keypair():
    private_key=rsa.generate_private_key(
        public_exponent=65537,
        key_size=RSA_BITS,
        backend=Backend
    )
    public_key=private_key.public_key()
    priv_pem=private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    pub_pem=public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    return priv_pem,pub_pem
def aesgcm_encrypt(key:bytes,plaintext:bytes,aad:bytes | None=None):
    if len(key) !=32:
        raise ValueError(f"Aes key must be 32 bytes")
    if not isinstance(plaintext,bytes):
        raise TypeError(f"Plaintext must be bytes ")
    
    nonce=os.urandom(12)
    aesgcm=AESGCM(key)
    try:
        ciphertext=aesgcm.encrypt(nonce,plaintext,aad)
        return nonce,ciphertext
    except Exception as e:
        raise RuntimeError(f"AES-GCM encryption failed")
    
def aesgcm_decrypt(key:bytes,nonce:bytes,ciphertext:bytes,aad:bytes | None=None):
    if len(key) !=32:
        raise ValueError(f"AES key must be 32 bytes")
    if len(nonce) !=12:
        raise TypeError(f"Nobce must be 12 bytes")
    if not isinstance(ciphertext,bytes):
        raise TypeError(f"Plaintext must be bytes ")
    if len(ciphertext) <16:
        raise ValueError(f"Cipher is too short")
    aesgcm=AESGCM(key)

    try:
       return aesgcm.decrypt(nonce,ciphertext,aad)
    except Exception as e:
        raise RuntimeError(f"AES-GCM decryption failed")
def rsa_encrypt(pub_pem:bytes,data:bytes)->bytes:
    if not isinstance(pub_pem,bytes):
        raise TypeError("Public key must be pem")
    if not isinstance(data,bytes):
        raise TypeError("data must be bytes ")
    
    max_size=(RSA_BITS//8)-2*(256//8)-2
    if len(data)>max_size:
        raise ValueError("Data too large")
    try:
        public_key=serialization.load_pem_public_key(pub_pem,backend=Backend)
        return public_key.encrypt(
            data,
            padding.OAEP(
             mgf=padding.MGF1(algorithm=hashes.SHA256()),
             algorithm=hashes.SHA256(),
             label=None
            )
        )
    except Exception as e:
        raise RuntimeError("RSA decryption failed")

def rsa_decrypt(priv_pem:bytes,data:bytes) -> bytes:
    if not isinstance(priv_pem,bytes):
        raise TypeError("Public key must be pem")
    if not isinstance(data,bytes):
        raise TypeError("data must be bytes ")
    try:
        private_key=serialization.load_pem_private_key(priv_pem,password=None,backend=Backend)
        return private_key.decrypt(
            data,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    except Exception as e:
        raise RuntimeError("RSA decryption failed")
def sha256_hex(data:bytes)->str:
     if not isinstance(data,bytes):
        raise TypeError("data must be bytes ")
     try:
         digest=hashes.Hash(hashes.SHA256(), backend=Backend)
         digest.update(data)
         return digest.finalize().hex()
     except Exception as e:
         raise RuntimeError("SHA256 hashing failed")
     
def encrypt_private_key(priv_pem:bytes,password:str):
    if not isinstance(priv_pem,bytes):
        raise TypeError("Public key must be pem")
    if not isinstance(password,str):
        raise TypeError("password must be bytes ")
    
    try:
        salt=os.urandom(16)
        key=derive_key(password,salt)
        nonce,cipher=aesgcm_encrypt(key,priv_pem)
        return salt,nonce,cipher
    except Exception as e:
         raise RuntimeError("SHA256 hashing failed")

def derive_key(password:str,salt:bytes,iterations:int=200_000)->bytes:
    if not isinstance(password,str):
        raise TypeError("1233Public key must be pem")
    if not isinstance(salt,bytes):
        raise TypeError("12333password must be bytes ")
    if len(salt)<16:
        raise ValueError("Salt should be 16 bytes")
    try:
        kbf=PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=iterations,
            backend=Backend
        )
        return kbf.derive(password.encode('utf-8'))
    except Exception as e:
        raise RuntimeError("key failed")
    
def decrypt_private_key(salt:bytes,nonce:bytes,cipher:bytes,password:str):
    if not isinstance(salt,bytes):
        raise TypeError("12331Public key must be pem")
    if not isinstance(nonce,bytes):
        raise TypeError("12332Public key must be pem")
    if not isinstance(cipher,bytes):
        raise TypeError("12333Public key must be pem")
    if not isinstance(password,str):
        raise TypeError("12334Public key must be pem")
    try:
        key=derive_key(password,salt)
        print(f"Debug Derived key SHA256={__import__('hashlib').sha256(key).hexdigest()}")
        print(f"Debug nonce len={len(nonce)},cipher len={len(cipher)}")
        return aesgcm_decrypt(key,nonce,cipher)
    except Exception as e:
        raise RuntimeError("Private key decryption failed")