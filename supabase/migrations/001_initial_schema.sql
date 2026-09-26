-- ============================================================
-- FinDocAI — Initial Schema Migration
-- Run this in the Supabase SQL Editor (or psql) to create all
-- tables. SQLAlchemy will also auto-create via create_all(),
-- but this script is useful for manual inspection / seeding.
-- ============================================================

-- ---- Enum-like check constraints (replaces Python enums) ----

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    full_name   VARCHAR NOT NULL,
    role        VARCHAR NOT NULL DEFAULT ''ANALYST'',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE TABLE IF NOT EXISTS documents (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename            VARCHAR NOT NULL,
    original_name       VARCHAR NOT NULL,
    file_type           VARCHAR NOT NULL,
    mime_type           VARCHAR,
    file_size           INTEGER NOT NULL,
    document_category   VARCHAR NOT NULL DEFAULT ''OTHER'',
    status              VARCHAR NOT NULL DEFAULT ''UPLOADED'',
    page_count          INTEGER DEFAULT 1,
    storage_path        VARCHAR NOT NULL,
    error_message       TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_pages (
    id              SERIAL PRIMARY KEY,
    document_id     INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number     INTEGER NOT NULL,
    extracted_text  TEXT,
    metadata_json   TEXT
);

CREATE TABLE IF NOT EXISTS extracted_fields (
    id              SERIAL PRIMARY KEY,
    document_id     INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_name      VARCHAR NOT NULL,
    field_value     VARCHAR,
    confidence      DOUBLE PRECISION DEFAULT 1.0,
    source_page     INTEGER DEFAULT 1,
    bounding_box_json TEXT
);

CREATE TABLE IF NOT EXISTS bank_transactions (
    id              SERIAL PRIMARY KEY,
    document_id     INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    date            VARCHAR NOT NULL,
    description     VARCHAR NOT NULL,
    debit           DOUBLE PRECISION DEFAULT 0.0,
    credit          DOUBLE PRECISION DEFAULT 0.0,
    balance         DOUBLE PRECISION DEFAULT 0.0,
    reference_no    VARCHAR,
    is_anomaly      BOOLEAN DEFAULT FALSE,
    anomaly_reason  VARCHAR
);

CREATE TABLE IF NOT EXISTS invoices (
    id              SERIAL PRIMARY KEY,
    document_id     INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    invoice_number  VARCHAR NOT NULL,
    invoice_date    VARCHAR,
    vendor_name     VARCHAR,
    customer_name   VARCHAR,
    gstin           VARCHAR,
    hsn_sac         VARCHAR,
    taxable_amount  DOUBLE PRECISION DEFAULT 0.0,
    cgst            DOUBLE PRECISION DEFAULT 0.0,
    sgst            DOUBLE PRECISION DEFAULT 0.0,
    igst            DOUBLE PRECISION DEFAULT 0.0,
    total_amount    DOUBLE PRECISION DEFAULT 0.0,
    is_duplicate    BOOLEAN DEFAULT FALSE,
    duplicate_of_id INTEGER
);

CREATE TABLE IF NOT EXISTS gst_records (
    id                  SERIAL PRIMARY KEY,
    document_id         INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    gstin               VARCHAR NOT NULL,
    business_name       VARCHAR,
    filing_period       VARCHAR,
    taxable_turnover    DOUBLE PRECISION DEFAULT 0.0,
    cgst_paid           DOUBLE PRECISION DEFAULT 0.0,
    sgst_paid           DOUBLE PRECISION DEFAULT 0.0,
    igst_paid           DOUBLE PRECISION DEFAULT 0.0,
    total_tax           DOUBLE PRECISION DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS financial_metrics (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_key      VARCHAR NOT NULL,
    metric_value    DOUBLE PRECISION NOT NULL,
    period          VARCHAR,
    details_json    TEXT
);

CREATE TABLE IF NOT EXISTS anomalies (
    id              SERIAL PRIMARY KEY,
    document_id     INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    anomaly_type    VARCHAR NOT NULL,
    severity        VARCHAR DEFAULT ''MEDIUM'',
    description     TEXT NOT NULL,
    explanation     TEXT,
    details_json    TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    id                      SERIAL PRIMARY KEY,
    user_id                 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_score           INTEGER NOT NULL,
    risk_level              VARCHAR NOT NULL,
    positive_factors_json   TEXT,
    risk_factors_json       TEXT,
    breakdown_json          TEXT,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR DEFAULT ''Financial Query Session'',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id              SERIAL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender          VARCHAR NOT NULL,
    content         TEXT NOT NULL,
    citations_json  TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    action      VARCHAR NOT NULL,
    target_type VARCHAR,
    target_id   VARCHAR,
    details     TEXT,
    timestamp   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
