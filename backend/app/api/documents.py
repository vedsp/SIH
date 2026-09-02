import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.models import User, Document, DocumentStatus, DocumentCategory, DocumentPage, ExtractedField, BankTransaction, Invoice, GSTRecord, Anomaly
from app.schemas.schemas import DocumentResponse, DocumentDetailResponse, DashboardOverview, MessageResponse
from app.api.deps import get_current_user
from app.services.document_classification import classify_text_content

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB limit

@router.post("/upload", response_model=List[DocumentResponse], status_code=status.HTTP_201_CREATED)
async def upload_documents(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_docs = []
    
    for file in files:
        # Validate filename and extension
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PNG, JPG, JPEG, CSV, XLSX."
            )
            
        # Read content and validate size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File '{filename}' exceeds maximum allowed size of 25MB."
            )
            
        # Save file to storage
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        storage_path = os.path.join(settings.STORAGE_DIR, unique_filename)
        with open(storage_path, "wb") as f:
            f.write(content)
            
        # Extract initial raw text or inspect filename for classification
        extracted_text_preview = ""
        file_type = ext.replace(".", "")
        if ext == ".pdf":
            try:
                import fitz
                doc = fitz.open(storage_path)
                page_text_list = [page.get_text() for page in doc]
                extracted_text_preview = " ".join(page_text_list)
                page_count = len(doc)
            except Exception:
                page_count = 1
                extracted_text_preview = filename
        else:
            page_count = 1
            extracted_text_preview = filename
            
        # Auto-classify document type
        category = classify_text_content(extracted_text_preview, filename)
        
        # Create database record
        doc_record = Document(
            user_id=current_user.id,
            filename=unique_filename,
            original_name=filename,
            file_type=file_type,
            mime_type=file.content_type,
            file_size=len(content),
            document_category=category,
            status=DocumentStatus.EXTRACTED.value if extracted_text_preview else DocumentStatus.UPLOADED.value,
            page_count=page_count,
            storage_path=storage_path
        )
        db.add(doc_record)
        db.commit()
        db.refresh(doc_record)
        
        # Save page text preview if available
        if extracted_text_preview:
            page_record = DocumentPage(
                document_id=doc_record.id,
                page_number=1,
                extracted_text=extracted_text_preview[:4000]
            )
            db.add(page_record)
            db.commit()
            
        uploaded_docs.append(DocumentResponse.model_validate(doc_record))
        
    return uploaded_docs

@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Document).filter(Document.user_id == current_user.id)
    if category:
        query = query.filter(Document.document_category == category)
    if status:
        query = query.filter(Document.status == status)
    
    docs = query.order_by(Document.created_at.desc()).all()
    return [DocumentResponse.model_validate(d) for d in docs]

@router.get("/dashboard/overview", response_model=DashboardOverview)
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_docs = db.query(Document).filter(Document.user_id == current_user.id).all()

    category_counts = {}
    for cat in DocumentCategory:
        category_counts[cat.value] = 0
    for doc in user_docs:
        category_counts[doc.document_category] = category_counts.get(doc.document_category, 0) + 1

    # Calculate financial totals from bank transactions or invoices
    total_rev = 0.0
    total_exp = 0.0

    txs = db.query(BankTransaction).join(Document).filter(Document.user_id == current_user.id).all()
    for tx in txs:
        total_rev += tx.credit
        total_exp += tx.debit

    # Count anomalies
    anomalies_count = db.query(Anomaly).join(Document).filter(Document.user_id == current_user.id).count()

    recent_docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).limit(5).all()

    return DashboardOverview(
        documents_processed=len(user_docs),
        total_revenue=round(total_rev, 2),
        total_expenses=round(total_exp, 2),
        net_cash_flow=round(total_rev - total_exp, 2),
        risk_score=72 if anomalies_count > 0 or len(user_docs) > 0 else 15,
        risk_level="MODERATE" if (anomalies_count > 0 or len(user_docs) > 0) else "LOW",
        category_counts=category_counts,
        recent_documents=[DocumentResponse.model_validate(d) for d in recent_docs],
        active_alerts_count=anomalies_count
    )

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document_detail(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    extracted_fields = [
        {"id": ef.id, "field_name": ef.field_name, "field_value": ef.field_value, "confidence": ef.confidence, "page": ef.source_page}
        for ef in doc.extracted_fields
    ]
    
    tx_count = db.query(BankTransaction).filter(BankTransaction.document_id == doc.id).count()
    inv_count = db.query(Invoice).filter(Invoice.document_id == doc.id).count()
    gst_count = db.query(GSTRecord).filter(GSTRecord.document_id == doc.id).count()
    anomaly_count = db.query(Anomaly).filter(Anomaly.document_id == doc.id).count()

    detail = DocumentDetailResponse(
        id=doc.id,
        filename=doc.filename,
        original_name=doc.original_name,
        file_type=doc.file_type,
        file_size=doc.file_size,
        document_category=doc.document_category,
        status=doc.status,
        page_count=doc.page_count,
        storage_path=doc.storage_path,
        error_message=doc.error_message,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
        extracted_fields=extracted_fields,
        bank_transactions_count=tx_count,
        invoices_count=inv_count,
        gst_records_count=gst_count,
        anomalies_count=anomaly_count
    )
    return detail

@router.delete("/{document_id}", response_model=MessageResponse)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete file from local storage if exists
    if os.path.exists(doc.storage_path):
        try:
            os.remove(doc.storage_path)
        except Exception:
            pass
            
    db.delete(doc)
    db.commit()
    return MessageResponse(message="Document deleted successfully", status="success")
