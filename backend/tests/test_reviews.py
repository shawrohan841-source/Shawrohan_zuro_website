"""Tests for the new review reply endpoints and review submission with images."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://zuro-premium.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@zuro.com"
ADMIN_PASS = "ZuroAdmin@2024"


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    assert r.status_code == 200, f"admin login failed {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def user_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"reviewer_{uuid.uuid4().hex[:8]}@zuro.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Test@123", "name": "Reviewer User"})
    assert r.status_code == 200, f"register failed {r.status_code} {r.text}"
    s.email = email
    return s


@pytest.fixture(scope="module")
def product_id():
    r = requests.get(f"{API}/products")
    assert r.status_code == 200
    plist = r.json()
    assert len(plist) > 0
    return plist[0]["id"]


# ===== Admin reviews list =====
def test_admin_reviews_list(admin_session):
    r = admin_session.get(f"{API}/admin/reviews")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)


def test_admin_reviews_unauth():
    r = requests.get(f"{API}/admin/reviews")
    assert r.status_code in (401, 403)


# ===== Review submission with images =====
def test_create_review_with_images(user_session, product_id):
    payload = {
        "product_id": product_id,
        "rating": 5,
        "comment": f"TEST review with images {uuid.uuid4().hex[:6]}",
        "images": [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ],
    }
    r = user_session.post(f"{API}/reviews", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "verified_purchase" in data


def test_review_stats_breakdown(product_id):
    r = requests.get(f"{API}/reviews/product/{product_id}")
    assert r.status_code == 200
    data = r.json()
    assert "reviews" in data
    assert "stats" in data
    stats = data["stats"]
    assert "total" in stats and "average" in stats and "breakdown" in stats
    # breakdown should have keys 1..5
    for k in ("1", "2", "3", "4", "5"):
        assert k in stats["breakdown"]
    # The image should be present in at least one review (we just added one)
    has_imgs = any(r.get("images") for r in data["reviews"])
    assert has_imgs, "no review with images returned in product reviews"


# ===== Admin reply CRUD =====
@pytest.fixture(scope="module")
def created_review_id(admin_session, product_id):
    # Use a separate user to create a review
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"replytarget_{uuid.uuid4().hex[:8]}@zuro.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Test@123", "name": "Reply Target"})
    assert r.status_code == 200
    cr = s.post(f"{API}/reviews", json={
        "product_id": product_id,
        "rating": 4,
        "comment": f"TEST review for reply {uuid.uuid4().hex[:6]}",
        "images": [],
    })
    assert cr.status_code == 200, cr.text

    # Fetch via admin endpoint to get review id
    rev_list = admin_session.get(f"{API}/admin/reviews").json()
    target = next((rv for rv in rev_list if rv.get("user_name") == "Reply Target"), None)
    assert target is not None
    return target["id"]


def test_admin_reply_add(admin_session, created_review_id):
    r = admin_session.post(
        f"{API}/admin/reviews/{created_review_id}/reply",
        json={"reply": "Thanks for your feedback!"},
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["reply"]["text"] == "Thanks for your feedback!"
    assert data["reply"]["admin_name"]


def test_admin_reply_persisted(admin_session, created_review_id):
    rev_list = admin_session.get(f"{API}/admin/reviews").json()
    rev = next(r for r in rev_list if r["id"] == created_review_id)
    assert rev.get("admin_reply", {}).get("text") == "Thanks for your feedback!"


def test_admin_reply_empty_text(admin_session, created_review_id):
    r = admin_session.post(
        f"{API}/admin/reviews/{created_review_id}/reply",
        json={"reply": "   "},
    )
    assert r.status_code == 400


def test_admin_reply_delete(admin_session, created_review_id):
    r = admin_session.delete(f"{API}/admin/reviews/{created_review_id}/reply")
    assert r.status_code == 200
    # Verify removed
    rev_list = admin_session.get(f"{API}/admin/reviews").json()
    rev = next(r for r in rev_list if r["id"] == created_review_id)
    assert "admin_reply" not in rev or rev.get("admin_reply") in (None, {})


def test_admin_reply_404(admin_session):
    r = admin_session.post(
        f"{API}/admin/reviews/nonexistent-id-xyz/reply",
        json={"reply": "hi"},
    )
    assert r.status_code == 404


# ===== Admin moderate feature =====
def test_admin_feature_review(admin_session, created_review_id):
    r = admin_session.put(
        f"{API}/admin/reviews/{created_review_id}/moderate",
        params={"action": "feature"},
    )
    assert r.status_code == 200
    rev_list = admin_session.get(f"{API}/admin/reviews").json()
    rev = next(r for r in rev_list if r["id"] == created_review_id)
    assert rev.get("featured") is True


def test_admin_unfeature_review(admin_session, created_review_id):
    r = admin_session.put(
        f"{API}/admin/reviews/{created_review_id}/moderate",
        params={"action": "unfeature"},
    )
    assert r.status_code == 200


def test_admin_moderate_invalid_action(admin_session, created_review_id):
    r = admin_session.put(
        f"{API}/admin/reviews/{created_review_id}/moderate",
        params={"action": "explode"},
    )
    assert r.status_code == 400
