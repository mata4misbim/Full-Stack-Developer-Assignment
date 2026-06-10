from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User

class UserAuthTests(APITestCase):
    def setUp(self):
        
        self.register_url = '/api/auth/register/'

    def test_register_buyer_success(self):
        """สมัครสมาชิก Buyer"""
        data = {
            "username": "buyer_test",
            "email": "buyer@example.com",
            "password": "password123",
            "role": "buyer"
        }
        response = self.client.post(self.register_url, data, format='json')
        
        
        if response.status_code == 404:
            self.register_url = '/api/users/register/'
            response = self.client.post(self.register_url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().role, 'buyer')

    def test_register_seller_success(self):
        """สมัครสมาชิก Seller"""
        data = {
            "username": "seller_test",
            "email": "seller@example.com",
            "password": "password123",
            "role": "seller"
        }
        response = self.client.post(self.register_url, data, format='json')
        
        
        if response.status_code == 404:
            self.register_url = '/api/users/register/'
            response = self.client.post(self.register_url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get().role, 'seller')

    def test_register_duplicate_email_or_username(self):
        """ข้อมูลซ้ำ"""
        data = {
            "username": "duplicate_user",
            "email": "dup@example.com",
            "password": "password123",
            "role": "buyer"
        }
        # ลองยิงรอบแรกเพื่อบันทึกข้อมูลตั้งต้นลงในระบบจำลอง
        response = self.client.post(self.register_url, data, format='json')
        if response.status_code == 404:
            self.register_url = '/api/users/register/'
            self.client.post(self.register_url, data, format='json')
        
        # ส่งข้อมูลเดิมซ้ำไปอีกรอบ ระบบต้องตอบกลับเป็น 400 Bad Request
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)