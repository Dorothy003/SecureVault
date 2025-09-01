from ast import Str
from datetime import datetime
from networkx import relabel_gexf_graph
from regex import T
from sqlalchemy import Column, ForeignKey,Integer,String,LargeBinary,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
Base=declarative_base()

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True,nullable=False)
    hash_password=Column(String,nullable=False)
    role=Column(String,default="user")

    public_key_pem=Column(LargeBinary,nullable=False)
    enc_priv_salt=Column(LargeBinary,nullable=False)
    enc_priv_nonce=Column(LargeBinary,nullable=False)
    enc_priv_cipher=Column(LargeBinary,nullable=False)

    created_at=Column(DateTime,default=datetime.utcnow)
    
class File(Base):
    __tablename__="files"

    id=Column(Integer,primary_key=True,index=True)
    owner_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    filename=Column(String,nullable=False)
    storage_path=Column(String,nullable=False)
    sha256=Column(String, nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)
    owner=relationship("User",backref="files")
    keys=relationship("FileKey",back_populates="file",cascade="all, delete-orphan")


class FileKey(Base):
    __tablename__="file_keys"
    id=Column(Integer,primary_key=True,nullable=False)
    file_id=Column(Integer,ForeignKey("files.id"),nullable=False)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    enc_key=Column(LargeBinary,nullable=False)
    created_at=Column(DateTime,default=datetime.utcnow)

    file=relationship("File",back_populates="keys")
    user=relationship("User")
