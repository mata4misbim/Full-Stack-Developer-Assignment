from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from products.models import Product
from cart.models import CartItem
from .models import Order

User = get_user_model()

class OrderCheckoutTests(APITestCase):
    def setUp(self):
        self.buyer = User.objects.create_user(username="buyer1", email="b1@test.com", password="password", role="buyer")
        self.seller = User.objects.create_user(username="seller1", email="s1@test.com", password="password", role="seller")
        
        self.product = Product.objects.create(
            title="Premium Coffee", description="Delicious Beans", price=300.00, quantity=10, seller=self.seller
        )
        
        self.cart_item = CartItem.objects.create(buyer=self.buyer, product=self.product, quantity=3)
        self.checkout_url = '/api/orders/'

    def test_checkout_creates_order_and_decreases_inventory(self):
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.checkout_url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        
        order = Order.objects.get()
        self.assertEqual(order.total_price, 900.00)
        
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 7)
        self.assertFalse(CartItem.objects.filter(buyer=self.buyer).exists())

    def test_checkout_with_empty_cart_fails(self):
        self.cart_item.delete()
        self.client.force_authenticate(user=self.buyer)
        response = self.client.post(self.checkout_url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ไม่มีสินค้าในตะกร้า", response.data.get('error', str(response.data)))