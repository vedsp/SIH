import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("--- 1. Testing Health Endpoint ---")
    r = requests.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health failed: {r.text}"
    print("[OK] Health check passed:", r.json())

    print("\n--- 2. Testing User Registration ---")
    reg_data = {
        "email": "sih_test_analyst@findoc.ai",
        "password": "SecurePassword123!",
        "full_name": "SIH Evaluator",
        "role": "ANALYST"
    }
    r = requests.post(f"{BASE_URL}/api/v1/auth/register", json=reg_data)
    if r.status_code == 400 and "already exists" in r.text:
        print("User already registered, proceeding to login.")
    else:
        assert r.status_code == 201, f"Registration failed: {r.text}"
        print("[OK] User registration passed:", r.json()["user"]["email"])

    print("\n--- 3. Testing User Login ---")
    login_data = {
        "email": "sih_test_analyst@findoc.ai",
        "password": "SecurePassword123!"
    }
    r = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
    assert r.status_code == 200, f"Login failed: {r.text}"
    token = r.json()["access_token"]
    print("[OK] Login passed! Access Token obtained.")

    headers = {"Authorization": f"Bearer {token}"}

    print("\n--- 4. Testing Synthetic Demo Seeding ---")
    r = requests.post(f"{BASE_URL}/api/v1/demo/seed", headers=headers)
    assert r.status_code == 200, f"Demo seed failed: {r.text}"
    print("[OK] Demo seeder passed:", r.json()["message"])

    print("\n--- 5. Testing Document Listing ---")
    r = requests.get(f"{BASE_URL}/api/v1/documents/", headers=headers)
    assert r.status_code == 200, f"Document listing failed: {r.text}"
    docs = r.json()
    print(f"[OK] Document listing passed! Total documents: {len(docs)}")
    for d in docs:
        print(f"  - [{d['document_category']}] {d['original_name']} ({d['status']})")

    print("\n--- 6. Testing Dashboard Overview ---")
    r = requests.get(f"{BASE_URL}/api/v1/documents/dashboard/overview", headers=headers)
    assert r.status_code == 200, f"Dashboard overview failed: {r.text}"
    overview = r.json()
    print("[OK] Dashboard Overview passed:")
    print(f"  Processed Docs: {overview['documents_processed']}")
    print(f"  Total Revenue: Rs. {overview['total_revenue']}")
    print(f"  Total Expenses: Rs. {overview['total_expenses']}")
    print(f"  Net Cash Flow: Rs. {overview['net_cash_flow']}")
    print(f"  Risk Score: {overview['risk_score']}/100 ({overview['risk_level']})")

    print("\n--- 7. Testing Document Upload ---")
    dummy_csv_content = "Date,Description,Debit,Credit,Balance\n2025-08-01,Test Transfer,0,50000,50000\n"
    files = [("files", ("test_bank_statement.csv", dummy_csv_content, "text/csv"))]
    r = requests.post(f"{BASE_URL}/api/v1/documents/upload", headers=headers, files=files)
    assert r.status_code == 201, f"Upload failed: {r.text}"
    uploaded = r.json()[0]
    print(f"[OK] File upload passed! Document ID: {uploaded['id']}, Category: {uploaded['document_category']}")

    print("\n--- 8. Testing Document Deletion ---")
    doc_to_delete = uploaded['id']
    r = requests.delete(f"{BASE_URL}/api/v1/documents/{doc_to_delete}", headers=headers)
    assert r.status_code == 200, f"Delete failed: {r.text}"
    print(f"[OK] Document deletion passed! Removed test document #{doc_to_delete}")

    print("\n==========================================")
    print("ALL PHASE 1 END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
