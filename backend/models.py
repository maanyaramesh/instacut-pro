import uuid
import secrets
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


def gen_id():
    return str(uuid.uuid4())


def gen_api_key():
    return "sk_live_" + secrets.token_hex(20)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_id)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, default=gen_api_key)
    credits = Column(Integer, default=50)  # free-tier starting credits
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("ImageJob", back_populates="owner")


class ImageJob(Base):
    __tablename__ = "image_jobs"

    id = Column(String, primary_key=True, default=gen_id)
    owner_id = Column(String, ForeignKey("users.id"))
    original_filename = Column(String)
    output_path = Column(String)  # relative path under /uploads
    mode = Column(String, default="transparent")  # transparent | color | gradient | blur
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="jobs")
