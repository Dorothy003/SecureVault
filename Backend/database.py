from requests import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQL_URL="sqlite:///./app.db"

engine=create_engine(
    SQL_URL,
    connect_args={"check_same_thread":False} if "sqlite" in SQL_URL else {}
)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()