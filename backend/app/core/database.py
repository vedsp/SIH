import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Ensure local storage directory exists (fallback for dev)
os.makedirs(settings.STORAGE_DIR, exist_ok=True)

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Disable prepared statements for Supabase pooler (port 6543 / pgbouncer)
    connect_args = {"prepare_threshold": None}

engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------------------------------------------------------
# Supabase client — initialised only when SUPABASE_URL is configured
# ---------------------------------------------------------------------------
supabase_client = None

if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    from supabase import create_client
    supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

