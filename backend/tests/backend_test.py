"""ZURO ecommerce backend API tests - auth, products, cart, orders, admin"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://zuro-premium.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@zuro.com"
ADMIN_PASS = "ZuroAdmin@2024"


@pytest.fixture(scope="session")
def user_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"test_{uuid.uuid4().hex[:8]}@zuro.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "Test@123", "name": "Test User"})
    assert r.status_code == 200, f"register failed {r.status_code} {r.text}"
    s.email = email
    s.user_id = r.json()["id"]
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    assert r.status_code == 200, f"admin login failed {r.status_code} {r.text}"
    assert r.json()["role"] == "admin"
    return s


# ===== Auth =====
class TestAuth:
    def test_register_duplicate(self, user_session):
        r = requests.post(f"{API}/auth/register", json={"email": user_session.email, "password": "x", "name": "y"})
        assert r.status_code == 400

    def test_login_invalid(self):
        r = requests.post(f"{API}/auth/login", json={"email": "nobody@zuro.com", "password": "wrong"})
        assert r.status_code == 401

    def test_me(self, user_session):
        r = user_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == user_session.email

    def test_me_unauth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ===== Products =====
class TestProducts:
    def test_list(self):
        r = requests.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0, "no seeded products"
        TestProducts.product_id = data[0]["id"]

    def test_get_one(self):
        r = requests.get(f"{API}/products/{TestProducts.product_id}")
        assert r.status_code == 200
        assert r.json()["id"] == TestProducts.product_id

    def test_get_404(self):
        r = requests.get(f"{API}/products/nope-xyz")
        assert r.status_code == 404

    def test_filter_category(self):
        r = requests.get(f"{API}/products", params={"category": "Hoodies"})
        assert r.status_code == 200

    def test_categories(self):
        r = requests.get(f"{API}/categories")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ===== Cart =====
class TestCart:
    def test_add_and_get(self, user_session):
        plist = requests.get(f"{API}/products").json()
        pid = plist[0]["id"]
        r = user_session.post(f"{API}/cart/add", json={"product_id": pid, "quantity": 2, "size": "M", "color": "Black"})
        assert r.status_code == 200
        g = user_session.get(f"{API}/cart")
        assert g.status_code == 200
        items = g.json().get("items", [])
        assert any(i["product_id"] == pid and i["quantity"] >= 2 for i in items)
        TestCart.pid = pid

    def test_remove(self, user_session):
        r = user_session.delete(f"{API}/cart/remove/{TestCart.pid}", params={"size": "M", "color": "Black"})
        assert r.status_code == 200


# ===== Orders =====
class TestOrders:
    def test_create_cod(self, user_session):
        plist = requests.get(f"{API}/products").json()
        pid = plist[0]["id"]
        payload = {
            "items": [{"product_id": pid, "quantity": 1, "size": "M", "color": "Black", "price": plist[0]["price"]}],
            "total": plist[0]["price"],
            "payment_method": "cod",
            "shipping_address": {"name": "Test", "phone": "1234567890", "address": "123", "city": "X", "state": "Y", "pincode": "12345"}
        }
        r = user_session.post(f"{API}/orders/create", json=payload)
        assert r.status_code == 200, r.text
        TestOrders.oid = r.json()["order_id"]

    def test_get_orders(self, user_session):
        r = user_session.get(f"{API}/orders")
        assert r.status_code == 200
        assert any(o["id"] == TestOrders.oid for o in r.json())

    def test_get_order(self, user_session):
        r = user_session.get(f"{API}/orders/{TestOrders.oid}")
        assert r.status_code == 200
        assert r.json()["status"] == "pending"


# ===== Wishlist =====
class TestWishlist:
    def test_add_get_remove(self, user_session):
        plist = requests.get(f"{API}/products").json()
        pid = plist[0]["id"]
        r = user_session.post(f"{API}/wishlist/add/{pid}")
        assert r.status_code == 200
        g = user_session.get(f"{API}/wishlist")
        assert g.status_code == 200
        assert pid in g.json().get("product_ids", [])
        d = user_session.delete(f"{API}/wishlist/remove/{pid}")
        assert d.status_code == 200


# ===== Admin =====
class TestAdmin:
    def test_dashboard(self, admin_session):
        r = admin_session.get(f"{API}/admin/dashboard")
        assert r.status_code == 200
        d = r.json()
        for k in ("total_orders", "total_revenue", "total_users", "total_products"):
            assert k in d

    def test_admin_orders(self, admin_session):
        r = admin_session.get(f"{API}/admin/orders")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_forbidden_for_user(self, user_session):
        r = user_session.get(f"{API}/admin/dashboard")
        assert r.status_code == 403

    def test_update_order_status(self, admin_session):
        orders = admin_session.get(f"{API}/admin/orders").json()
        if not orders:
            pytest.skip("no orders")
        oid = orders[0]["id"]
        r = admin_session.put(f"{API}/admin/orders/{oid}/status", params={"status": "shipped"})
        assert r.status_code == 200


# ===== Coupons =====
class TestCoupons:
    def test_invalid_coupon(self):
        r = requests.post(f"{API}/coupons/validate", json={"code": "NOTREAL_XYZ", "total": 1000})
        assert r.status_code == 404
