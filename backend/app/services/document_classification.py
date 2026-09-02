from app.models.models import DocumentCategory

def classify_text_content(text: str, filename: str = "") -> str:
    """
    Rule-based document classifier based on keywords and filename signals.
    Supports: BANK_STATEMENT, GST_RETURN, ITR, INVOICE, BALANCE_SHEET, PROFIT_LOSS, SALARY_SLIP, LOAN_DOCUMENT, OTHER.
    """
    content = text.lower() + " " + filename.lower()
    
    # 1. GST Return keywords
    gst_keywords = ["gstin", "cgst", "sgst", "igst", "gstr-1", "gstr-3b", "taxable turnover", "filing period", "input tax credit"]
    if sum(1 for k in gst_keywords if k in content) >= 2:
        return DocumentCategory.GST_RETURN.value
        
    # 2. Bank Statement keywords
    bank_keywords = ["account number", "ac no", "transaction date", "debit", "credit", "balance", "opening balance", "closing balance", "upi/", "neft/", "rtgs/"]
    if sum(1 for k in bank_keywords if k in content) >= 2:
        return DocumentCategory.BANK_STATEMENT.value
        
    # 3. Invoice keywords
    invoice_keywords = ["invoice number", "inv no", "bill to", "ship to", "hsn", "sac", "taxable amount", "subtotal", "total amount"]
    if sum(1 for k in invoice_keywords if k in content) >= 2:
        return DocumentCategory.INVOICE.value
        
    # 4. Income Tax Return (ITR) keywords
    itr_keywords = ["itr", "acknowledgement number", "assessment year", "total income", "section 80c", "tax payable", "form 16"]
    if sum(1 for k in itr_keywords if k in content) >= 2:
        return DocumentCategory.ITR.value
        
    # 5. Balance Sheet keywords
    bs_keywords = ["balance sheet", "current assets", "non-current assets", "current liabilities", "total equity", "shareholders equity", "retained earnings"]
    if sum(1 for k in bs_keywords if k in content) >= 2:
        return DocumentCategory.BALANCE_SHEET.value
        
    # 6. Profit & Loss keywords
    pnl_keywords = ["profit and loss", "p&l", "statement of profit", "cost of goods sold", "cogs", "gross profit", "net profit", "operating income"]
    if sum(1 for k in pnl_keywords if k in content) >= 2:
        return DocumentCategory.PROFIT_LOSS.value

    # 7. Salary Slip
    salary_keywords = ["pay slip", "salary slip", "basic pay", "hra", "pf contribution", "net pay", "employee code"]
    if sum(1 for k in salary_keywords if k in content) >= 2:
        return DocumentCategory.SALARY_SLIP.value

    # Default matching based on file name hints if content text was sparse
    if "bank" in filename.lower() or "statement" in filename.lower():
        return DocumentCategory.BANK_STATEMENT.value
    elif "gst" in filename.lower() or "gstr" in filename.lower():
        return DocumentCategory.GST_RETURN.value
    elif "invoice" in filename.lower() or "inv" in filename.lower() or "bill" in filename.lower():
        return DocumentCategory.INVOICE.value
    elif "itr" in filename.lower() or "tax" in filename.lower():
        return DocumentCategory.ITR.value

    return DocumentCategory.OTHER.value
