from pydantic import BaseModel,EmailStr

class RegisterIn(BaseModel):
    email:EmailStr
    password:str
    role:str| None="user"

class LoginIn(BaseModel):
    email:EmailStr
    password:str

class TokenOut(BaseModel):
    access_token:str
    token_type:str="bearer"

class UserOut(BaseModel):
    id:int
    email:EmailStr
    role:str

    class Config:
        from_attributes=True
        