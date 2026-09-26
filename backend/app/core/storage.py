"""
storage.py -- File storage abstraction layer.

Routes uploads/downloads/deletes to Supabase Storage when configured,
and falls back to local disk when SUPABASE_URL is not set (local dev mode).
"""
import os
import uuid
import tempfile
from app.core.config import settings
from app.core.database import supabase_client


def _use_supabase() -> bool:
    return supabase_client is not None


def upload_file(file_bytes: bytes, original_filename: str) -> str:
    """
    Upload raw bytes to storage.

    Returns:
        str: A path/URL that uniquely identifies the stored file.
             - Supabase mode: public URL of the object in the bucket.
             - Local mode: absolute local filesystem path.
    """
    unique_name = f"{uuid.uuid4().hex}_{original_filename}"

    if _use_supabase():
        bucket = settings.SUPABASE_BUCKET
        supabase_client.storage.from_(bucket).upload(
            path=unique_name,
            file=file_bytes,
            file_options={"content-type": _guess_mime(original_filename)},
        )
        public_url: str = supabase_client.storage.from_(bucket).get_public_url(unique_name)
        return public_url
    else:
        os.makedirs(settings.STORAGE_DIR, exist_ok=True)
        local_path = os.path.join(settings.STORAGE_DIR, unique_name)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        return local_path


def download_file(storage_path: str) -> bytes:
    """
    Download a file and return its raw bytes.

    Args:
        storage_path: URL (Supabase) or local filesystem path.

    Returns:
        bytes: Raw file content.
    """
    if _use_supabase():
        bucket = settings.SUPABASE_BUCKET
        object_path = _extract_object_path(storage_path, bucket)
        response = supabase_client.storage.from_(bucket).download(object_path)
        return response
    else:
        with open(storage_path, "rb") as f:
            return f.read()


def delete_file(storage_path: str) -> None:
    """
    Delete a file from storage.

    Args:
        storage_path: URL (Supabase) or local filesystem path.
    """
    if _use_supabase():
        bucket = settings.SUPABASE_BUCKET
        object_path = _extract_object_path(storage_path, bucket)
        supabase_client.storage.from_(bucket).remove([object_path])
    else:
        if storage_path and os.path.exists(storage_path):
            try:
                os.remove(storage_path)
            except OSError:
                pass


def open_as_tempfile(storage_path: str, suffix: str = "") -> str:
    """
    Download a file from storage and write it to a temporary file on disk.
    Useful for libraries (e.g. PyMuPDF) that require a filesystem path.

    Returns:
        str: Path to the temporary file. Caller is responsible for deleting it.
    """
    file_bytes = download_file(storage_path)
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.write(file_bytes)
    tmp.flush()
    tmp.close()
    return tmp.name


def _guess_mime(filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    mime_map = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".csv": "text/csv",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
    }
    return mime_map.get(ext, "application/octet-stream")


def _extract_object_path(public_url: str, bucket: str) -> str:
    """
    Extract the Supabase Storage object path from a public URL.

    Example:
        URL:  https://abc.supabase.co/storage/v1/object/public/documents/uuid_file.pdf
        Path: uuid_file.pdf
    """
    marker = f"/object/public/{bucket}/"
    idx = public_url.find(marker)
    if idx != -1:
        return public_url[idx + len(marker):]
    return public_url.split("/")[-1]