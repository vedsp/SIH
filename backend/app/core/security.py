import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
from app.core.config import settings

def get_password_hash(password: str) -> str:
    """Secure password hashing using SHA256 + HMAC salt."""
    salt = settings.SECRET_KEY.encode('utf-8')
    pw_bytes = password.encode('utf-8')
    h = hmac.new(salt, pw_bytes, hashlib.sha256)
    return h.hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against stored hash."""
    return hmac.compare_digest(get_password_hash(plain_password), hashed_password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
