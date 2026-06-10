from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from products.models import Product
from .models import CartItem

User = get_user_model()

class CartAPITests(APITestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(username="buyer1", email="b1@test.com", password="password", role="buyer")
        self.seller = User.objects.create_user(username="seller1", email="s1@test.com", password="password", role="seller")
        
        self.product = Product.objects.create(
            title="Book", description="Read me", price=200.00, quantity=5, seller=self.seller
        )
        self.list_create_url = '/api/cart/'

    def test_add_to_cart_success(self):
        self.client.force_authenticate(user=self.buyer)
        data = {"product_id": self.product.id, "quantity": 2}
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CartItem.objects.filter(buyer=self.buyer).count(), 1)
        self.assertEqual(CartItem.objects.get().quantity, 2)

    def test_add_to_cart_exceed_stock_fails(self):
        self.client.force_authenticate(user=self.buyer)
        data = {"product_id": self.product.id, "quantity": 10}
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("สต็อกไม่พอ", response.data.get('error', str(response.data)))