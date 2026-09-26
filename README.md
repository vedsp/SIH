# FinDocAI

A local financial-document review application with authenticated uploads, document classification, stored document metadata, dashboard aggregates, and a synthetic demo dataset.

## Overview

FinDocAI currently provides a browser interface for registering and signing in users, uploading supported financial documents, storing document metadata, listing and filtering a user's documents, viewing document details, and deleting documents. PDF uploads receive a text preview when PyMuPDF can read them; uploaded content is classified with keyword and filename rules.

The application is intended for local demonstrations and early evaluation of a financial evidence workflow. Several navigation destinations are presentation-only demonstrations and are not backed by backend analysis services; those limitations are listed below.

- **Frontend:** React 18 with Vite, Tailwind CSS, Lucide icons, and client-side jsPDF report export.
- **Backend:** FastAPI with SQLAlchemy, JWT bearer authentication, and synchronous SQLAlchemy sessions.
- **Database and files:** SQLite by default (`backend/findocai.db`) and a local filesystem storage directory by default (`backend/storage`).

## Features

### Implemented

- User registration with email, full name, and password.
- User login with JWT bearer tokens and an authenticated `/auth/me` endpoint.
- User-scoped document upload for PDF, PNG, JPG/JPEG, CSV, XLS/XLSX files, with a 25 MB per-file limit.
- Local file persistence and SQLAlchemy document records.
- PDF text extraction using PyMuPDF when available.
- Rule-based classification into document categories such as bank statement, GST return, invoice, ITR, balance sheet, profit and loss, salary slip, loan document, or other.
- Document listing with optional category and status query filters.
- Document detail retrieval with stored extracted fields and related-record counts.
- Individual document deletion, including an attempt to remove its local storage file.
- Dashboard overview aggregation for document counts, bank transaction credits/debits, net cash flow, anomaly count, recent documents, and a simple risk value derived from document/anomaly presence.
- Synthetic ABC Manufacturing Pvt Ltd demo seeding with persisted sample documents, extracted fields, bank transactions, GST data, invoices, anomalies, and a risk assessment.
- Demo unloading scoped to the current user, including removal of seeded documents and risk assessments.
- Browser-side PDF export of the currently presented static financial report template using jsPDF.

### Planned / Demo Only

These pages are present in the frontend but do not currently call backend analysis endpoints:

- **Cross Verification:** `AnalysisPage.jsx` renders hardcoded bank/GST and GST/invoice comparisons.
- **Transaction and Anomaly Analysis:** `AnomaliesPage.jsx` renders hardcoded anomaly examples. The backend demo seeder does persist anomaly records, but there is no anomaly listing API used by this page.
- **Explainable Risk Score:** `RiskPage.jsx` renders hardcoded factor scores and explanations. It does not read the persisted `RiskAssessment` record.
- **Financial Reports:** `ReportsPage.jsx` displays a fixed ABC Manufacturing report and exports fixed content to a client-generated PDF; there is no backend report-generation endpoint and the report is not assembled from queried database records.
- **Assessment and financial year fields:** the top-bar selectors derive year options from document names/dates in the document list, but year values are not stored as dedicated document fields or filtered by backend queries.

*(Note: The Dashboard and Assistant Copilot pages are now fully dynamic and respond to real database state.)*

## Tech Stack

### Frontend dependencies

- React 18 and React DOM 18: UI runtime.
- Vite: development server and production bundler.
- Tailwind CSS, PostCSS, and Autoprefixer: styling pipeline.
- `lucide-react`: interface icons.
- `jspdf`: client-side PDF export on the Reports page.
- `recharts`: listed in `frontend/package.json`, but no current source import was found.
- TypeScript React type packages: listed development dependencies; the current application source is JSX, not TypeScript.

### Backend dependencies

- FastAPI: HTTP API and OpenAPI documentation.
- Uvicorn: ASGI server.
- SQLAlchemy: ORM and database access.
- Pydantic and pydantic-settings: request/response schemas and settings.
- `python-jose[cryptography]`: JWT creation and validation.
- `python-multipart`: multipart upload handling through FastAPI.
- PyMuPDF (`pymupdf`, imported as `fitz`): PDF text extraction.

The following packages are listed in `backend/requirements.txt` but are not imported by the current application code: `passlib[bcrypt]`, `scikit-learn`, `numpy`, `pandas`, `openpyxl`, `reportlab`, `requests`, and `jinja2`. The security module currently uses Python `hashlib` and `hmac` directly rather than Passlib.

## Project Structure

```text
findoc-ai-SIH2026/
├── backend/
│   ├── app/
│   │   ├── api/          # Authentication, document, and demo routes
│   │   ├── core/         # Settings, SQLAlchemy setup, JWT/password helpers
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── schemas/      # Pydantic request and response schemas
│   │   └── services/     # Rule-based document classification
│   ├── storage/          # Local uploaded/demo file storage
│   ├── requirements.txt
│   └── test_phase1.py    # HTTP smoke/integration script
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, sidebar, upload modal, tables, cards
│   │   ├── context/      # Authentication context
│   │   ├── pages/        # Auth, dashboard, documents, and demo pages
│   │   └── services/     # Browser API client
│   ├── public/
│   └── package.json
├── package.json          # Root scripts forwarding to frontend
└── README.md
```

## Setup & Installation

### Prerequisites

- Python version is not pinned by the repository. The current development environment uses Python 3.13; use a supported recent Python version compatible with the pinned FastAPI/Pydantic dependencies.
- Node.js version is not pinned in `package.json`. Use a current Node.js LTS release with npm.
- Git.

### Backend setup

From the repository root in PowerShell:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` with at least:

```env
SECRET_KEY=replace-with-a-long-random-secret
```

Run the backend from the `backend` directory so the relative `.env`, SQLite URL, and storage paths resolve as intended:

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`. FastAPI documentation is available at `/docs`, and the health endpoint is `/health`.

### Frontend setup

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173` by default. The frontend API client currently targets `http://127.0.0.1:8000/api/v1` directly.

The root scripts can also be used from the repository root:

```powershell
npm install
npm run dev
npm run build
npm run preview
```

### Database setup

There are no migrations or Alembic configuration in the repository. Importing `app.main` calls SQLAlchemy `Base.metadata.create_all(bind=engine)`, creating missing tables in the configured database. With default settings, the SQLite file is `backend/findocai.db` when the backend is started from `backend/`.

### Run both together

Start the backend and frontend in separate terminals using the commands above, then open `http://localhost:5173`.

## Environment Variables

Settings are loaded by `pydantic-settings` from the process environment and `backend/.env`. The default SQLite/storage values are evaluated relative to the backend process working directory.

| Variable | Required | Default | Description |
|---|---:|---|---|
| `PROJECT_NAME` | No | `FinDocAI` | FastAPI application title and root response name. |
| `PROJECT_VERSION` | No | `1.0.0` | Application version exposed by FastAPI and the root endpoint. |
| `API_V1_STR` | No | `/api/v1` | Prefix applied to auth, document, and demo routes. |
| `SECRET_KEY` | **Yes** | None | Key used for password hashing and JWT signing; must be set, with no default in production. |
| `ALGORITHM` | No | `HS256` | JWT signing algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `10080` | JWT lifetime; the default is seven days. |
| `DATABASE_URL` | No | `sqlite:///./findocai.db` | SQLAlchemy database URL. |
| `STORAGE_DIR` | No | `./storage` | Directory for uploaded files and demo file paths. |

## API Overview

All application resource routes use the `/api/v1` prefix unless noted otherwise. Protected routes require `Authorization: Bearer <token>`.

### Root and health

- `GET /` — returns application name, version, online status, and documentation path.
- `GET /health` — returns a basic health response.

### Auth

- `POST /api/v1/auth/register` — creates an analyst user and returns a JWT plus user data.
- `POST /api/v1/auth/login` — verifies email/password and returns a JWT plus user data.
- `GET /api/v1/auth/me` — returns the authenticated user.

### Documents

- `POST /api/v1/documents/upload` — uploads one or more supported files for the authenticated user, stores them locally, extracts a PDF text preview when possible, classifies the document, and persists the document record.
- `GET /api/v1/documents/` — lists the authenticated user's documents; supports optional `category` and `status` query parameters.
- `GET /api/v1/documents/dashboard/overview` — returns document counts, financial totals from stored bank transactions, anomaly count, recent documents, and a simple risk summary.
- `GET /api/v1/documents/{document_id}` — returns document metadata, extracted fields, and related entity counts for an owned document.
- `DELETE /api/v1/documents/{document_id}` — deletes an owned document and attempts to remove its local file.

### Demo

- `POST /api/v1/demo/seed` — creates the synthetic ABC Manufacturing Pvt Ltd dataset for the authenticated user.
- `DELETE /api/v1/demo` — removes seeded demo documents and the current user's risk assessment, scoped to the authenticated user.

## Known Limitations

- Several UI pages are static/demo-only and are not connected to backend query routes; see **Planned / Demo Only** above.
- The report PDF is generated in the browser from fixed report content, not from live database results.
- The frontend API base URL is hardcoded to `http://127.0.0.1:8000/api/v1`; deployment requires changing this client configuration.
- SQLite and local filesystem storage are suitable for local demonstrations but are not appropriate for reliable multi-instance/serverless persistence without replacement by hosted database and object storage services.
- Document listing loads the user's full matching result set; there is no pagination.
- The dashboard aggregates all matching user documents and bank transactions in memory for each request.
- Demo seeding is not idempotent; repeated calls can create duplicate synthetic records. Unloading identifies demo documents by a filename prefix and removes the user's risk assessment records.
- Database schema changes have no migration workflow; `create_all` only creates missing tables and does not manage schema evolution.
- The dashboard overview route is declared after the dynamic `/documents/{document_id}` route. Route ordering should be reviewed because the dynamic route can intercept the dashboard path in FastAPI.
- Password hashing currently uses HMAC-SHA256 with the application secret rather than a password-specific adaptive password hashing scheme. This should be upgraded before production use.
- CORS currently allows all origins with credentials enabled; this should be restricted for deployment.
- JWT tokens are stored by the browser client in `localStorage`, which requires a deliberate XSS/security review before production use.
- Uploaded file names and local storage paths are persisted, while access to files is not exposed through a dedicated download endpoint.
- There is no Neo4j integration, Supabase integration, hosted database configuration, or external AI/LLM service in the current codebase.

## License / Team / Acknowledgments

- **Team:** _Add team name and members._
- **Hackathon:** _Add hackathon name and year._
- **License:** _Add license information._
- **Acknowledgments:** _Add mentors, datasets, libraries, or other acknowledgments._
