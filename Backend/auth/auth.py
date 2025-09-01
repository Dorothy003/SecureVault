from curses import tparm
from curses.ascii import HT
import email
from warnings import deprecated
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException,status,Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from models import User
from datetime import datetime,timedelta
from typing import Optional
import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY=os.getenv("JWT_SECRET")
ALGO="HS256"
EXPIRE=60

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")
oath2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password:str)->str:
    return pwd_context.hash(password)
def verify_password(password:str,hashed:str)->bool:
    return pwd_context.verify(password,hashed)
def create_access_token(subject:str, role:str,expires_delta:Optional[timedelta]=None)->str:
    if expires_delta is None:
        expires_delta=timedelta(minutes=EXPIRE)
    to_encode={
        "sub":subject,
        "role":role,
        "exp":datetime.utcnow()+expires_delta,
        "iat":datetime.utcnow(),
    }
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGO)

def decode_token(token:str)->dict:
    try:
        return jwt.decode(token,SECRET_KEY,algorithms=[ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401,detail="Invalid detail")
    
def get_current_user(db:Session ,token:str=Depends(oath2_scheme)):
    payload=decode_token(token)
    email=payload.get("sub")
    if not email:
        raise HTTPException(status_code=401,detail="User not found")
    user=db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(status_code=401,detail="User not found")
    return user
def require_role(*roles:str):
    def checker(user:User=Depends(get_current_user_dep)):
        if user.role not in roles:
            raise HTTPException(status_code=403,detail="Insufficient permissions")
        return user
    return checker
def get_current_user_dep(token :str=Depends(oath2_scheme),db:Session=Depends(lambda:None)):
    ...