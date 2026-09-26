from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import (
    User, Document, DocumentCategory, DocumentStatus,
    BankTransaction, Invoice, GSTRecord, Anomaly, RiskAssessment, ExtractedField
)
from app.schemas.schemas import MessageResponse
from app.api.deps import get_current_user
from app.core import storage
import json
import os
from io import BytesIO
from reportlab.pdfgen import canvas

def _generate_dummy_pdf(title: str, text_content: str) -> bytes:
    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, title)
    c.setFont("Helvetica", 12)
    c.drawString(100, 700, text_content)
    c.drawString(100, 680, "This is a system-generated dummy document for testing.")
    c.save()
    return buffer.getvalue()



router = APIRouter(prefix="/demo", tags=["demo"])

@router.post("/seed", response_model=MessageResponse)
def seed_demo_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Seeds synthetic demo data for 'ABC Manufacturing Pvt Ltd' (Requirement #28).
    Creates controlled inconsistencies for SIH hackathon demonstration:
    - Bank Statement credits: ₹18,70,000
    - GST Return turnover: ₹14,80,000
    - Invoices total: ₹16,20,000
    - Anomaly: Payment of ₹9,99,999 to XYZ Traders (4.8x average)
    - Duplicate Invoice: INV-1032 vs INV-1032-DUP
    """
    # 1. Create Bank Statement Document
    bank_pdf_bytes = _generate_dummy_pdf("HDFC Bank Statement", "ABC Manufacturing Pvt Ltd - 2025/2026")
    bank_path = storage.upload_file(bank_pdf_bytes, "demo_bank_statement_2025_2026.pdf")
    
    bank_doc = Document(
        user_id=current_user.id,
        filename="demo_bank_statement_2025_2026.pdf",
        original_name="HDFC_Bank_Statement_ABC_Mfg.pdf",
        file_type="pdf",
        file_size=len(bank_pdf_bytes),
        document_category=DocumentCategory.BANK_STATEMENT.value,
        status=DocumentStatus.COMPLETED.value,
        page_count=1,
        storage_path=bank_path
    )
    db.add(bank_doc)
    db.commit()
    db.refresh(bank_doc)

    # Add Extracted Fields for Bank Doc
    db.add_all([
        ExtractedField(document_id=bank_doc.id, field_name="Account Holder", field_value="ABC Manufacturing Pvt Ltd", confidence=0.99),
        ExtractedField(document_id=bank_doc.id, field_name="Account Number", field_value="XXXXXX4892", confidence=0.98),
        ExtractedField(document_id=bank_doc.id, field_name="Total Annual Credits", field_value="₹18,70,000", confidence=0.97),
        ExtractedField(document_id=bank_doc.id, field_name="Total Annual Debits", field_value="₹12,40,000", confidence=0.97),
    ])

    # Add Sample Bank Transactions
    transactions = [
        BankTransaction(document_id=bank_doc.id, date="2025-04-12", description="NEFT-CLIENT-ALPHA PAY", debit=0, credit=350000, balance=550000, reference_no="N1049281"),
        BankTransaction(document_id=bank_doc.id, date="2025-05-18", description="UPI-SUPPLIER-RAW MAT", debit=120000, credit=0, balance=430000, reference_no="U9302194"),
        BankTransaction(document_id=bank_doc.id, date="2025-06-25", description="NEFT-CLIENT-BETA CORP", debit=0, credit=520000, balance=950000, reference_no="N2049182"),
        BankTransaction(document_id=bank_doc.id, date="2025-07-12", description="RTGS-XYZ TRADERS SPECIAL PAY", debit=999999, credit=0, balance=-49999, is_anomaly=True, anomaly_reason="Unusual transaction amount: 4.8x higher than historical average payment (₹2,10,000)"),
        BankTransaction(document_id=bank_doc.id, date="2025-08-30", description="NEFT-CLIENT-GAMMA LTD", debit=0, credit=1000000, balance=950001, reference_no="N9402194")
    ]
    db.add_all(transactions)

    # 2. Create GST Return Document
    gst_pdf_bytes = _generate_dummy_pdf("GSTR3B Filing", "27AABC1234F1Z5 - Q4 2025")
    gst_path = storage.upload_file(gst_pdf_bytes, "demo_gstr3b_q4_2025.pdf")

    gst_doc = Document(
        user_id=current_user.id,
        filename="demo_gstr3b_q4_2025.pdf",
        original_name="GSTR3B_Filing_27AABC1234F1Z5.pdf",
        file_type="pdf",
        file_size=len(gst_pdf_bytes),
        document_category=DocumentCategory.GST_RETURN.value,
        status=DocumentStatus.COMPLETED.value,
        page_count=1,
        storage_path=gst_path
    )
    db.add(gst_doc)
    db.commit()
    db.refresh(gst_doc)

    db.add(GSTRecord(
        document_id=gst_doc.id,
        gstin="27AABC1234F1Z5",
        business_name="ABC Manufacturing Pvt Ltd",
        filing_period="2025-2026 Annual",
        taxable_turnover=1480000.0,
        cgst_paid=133200.0,
        sgst_paid=133200.0,
        igst_paid=0.0,
        total_tax=266400.0
    ))

    # 3. Create Invoice Documents
    inv_pdf_bytes = _generate_dummy_pdf("Invoice INV-1032", "Vendor: XYZ Traders | Amount: ₹9,67,600")
    inv1_path = storage.upload_file(inv_pdf_bytes, "demo_invoice_inv1032.pdf")

    inv_doc1 = Document(
        user_id=current_user.id,
        filename="demo_invoice_inv1032.pdf",
        original_name="Invoice_INV-1032_XYZTraders.pdf",
        file_type="pdf",
        file_size=len(inv_pdf_bytes),
        document_category=DocumentCategory.INVOICE.value,
        status=DocumentStatus.COMPLETED.value,
        page_count=1,
        storage_path=inv1_path
    )
    db.add(inv_doc1)
    db.commit()
    db.refresh(inv_doc1)

    inv1 = Invoice(
        document_id=inv_doc1.id,
        invoice_number="INV-1032",
        invoice_date="2025-07-12",
        vendor_name="XYZ Traders",
        customer_name="ABC Manufacturing Pvt Ltd",
        gstin="27XYZTR9876K1Z2",
        taxable_amount=820000.0,
        cgst=73800.0,
        sgst=73800.0,
        total_amount=967600.0
    )
    db.add(inv1)
    db.commit()

    inv2_path = storage.upload_file(inv_pdf_bytes, "demo_invoice_inv1032_dup.pdf")

    inv_doc2 = Document(
        user_id=current_user.id,
        filename="demo_invoice_inv1032_dup.pdf",
        original_name="Invoice_INV-1032_Duplicate_Copy.pdf",
        file_type="pdf",
        file_size=len(inv_pdf_bytes),
        document_category=DocumentCategory.INVOICE.value,
        status=DocumentStatus.COMPLETED.value,
        page_count=1,
        storage_path=inv2_path
    )
    db.add(inv_doc2)
    db.commit()
    db.refresh(inv_doc2)

    inv2 = Invoice(
        document_id=inv_doc2.id,
        invoice_number="INV-1032-DUP",
        invoice_date="2025-07-12",
        vendor_name="XYZ Traders",
        customer_name="ABC Manufacturing Pvt Ltd",
        gstin="27XYZTR9876K1Z2",
        taxable_amount=820000.0,
        cgst=73800.0,
        sgst=73800.0,
        total_amount=967600.0,
        is_duplicate=True,
        duplicate_of_id=inv1.id
    )
    db.add(inv2)

    # 4. Add Cross-Document Inconsistencies & Anomalies
    anomalies = [
        Anomaly(
            document_id=gst_doc.id,
            anomaly_type="CROSS_DOC_MISMATCH",
            severity="HIGH",
            description="Bank Statement credits (₹18.70 Lakh) exceed reported GST Turnover (₹14.80 Lakh) by ₹3.90 Lakh (26.3% discrepancy).",
            explanation="Annual bank credits of ₹18.70 lakh exceed declared GST turnover of ₹14.80 lakh. Requires human review to confirm whether non-GST income, exempt supplies, or under-reporting occurred.",
            details_json=json.dumps({"bank_credits": 1870000, "gst_turnover": 1480000, "difference": 390000})
        ),
        Anomaly(
            document_id=bank_doc.id,
            anomaly_type="UNUSUAL_TRANSACTION",
            severity="HIGH",
            description="Single large debit payment of ₹9,99,999 to XYZ Traders on 2025-07-12.",
            explanation="This transaction is approximately 4.8 times higher than the historical average payment (₹2,10,000) to vendor 'XYZ Traders'.",
            details_json=json.dumps({"transaction_id": "RTGS-XYZ", "amount": 999999, "historical_avg": 210000})
        ),
        Anomaly(
            document_id=inv_doc2.id,
            anomaly_type="DUPLICATE_INVOICE",
            severity="MEDIUM",
            description="Possible duplicate invoice detected: INV-1032-DUP matches INV-1032.",
            explanation="Invoice INV-1032-DUP matches vendor 'XYZ Traders', date '2025-07-12', and total amount ₹9,67,600 of invoice INV-1032.",
            details_json=json.dumps({"original_invoice": "INV-1032", "duplicate_invoice": "INV-1032-DUP", "amount": 967600})
        )
    ]
    db.add_all(anomalies)

    # 5. Add Risk Assessment Record
    risk = RiskAssessment(
        user_id=current_user.id,
        overall_score=72,
        risk_level="MODERATE",
        positive_factors_json=json.dumps([
            "Strong overall bank credit volume (₹18.70 Lakhs)",
            "Active customer transaction inflow pipeline",
            "Consistent GST filing history"
        ]),
        risk_factors_json=json.dumps([
            "Bank credits vs GST turnover mismatch (₹3.90 Lakh variance)",
            "Unusual high-value debit transaction (₹9.99 Lakhs - 4.8x average)",
            "Possible duplicate vendor invoice detected (INV-1032-DUP)"
        ]),
        breakdown_json=json.dumps({
            "cash_flow_stability": 80,
            "debt_burden": 70,
            "revenue_consistency": 75,
            "cross_document_consistency": 55,
            "transaction_anomalies": 60,
            "document_completeness": 90
        })
    )
    db.add(risk)
    db.commit()

    return MessageResponse(message="Demo dataset for ABC Manufacturing Pvt Ltd seeded successfully!")

@router.delete("", response_model=MessageResponse)
def unload_demo_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    demo_documents = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.filename.like("demo_%")
    ).all()

    for document in demo_documents:
        # Delete from storage (Supabase bucket or local disk); safe to call even for placeholder paths
        if document.storage_path:
            storage.delete_file(document.storage_path)
        db.delete(document)

    db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).delete(synchronize_session=False)
    db.commit()
    return MessageResponse(message="Demo dataset unloaded successfully!", status="success")

