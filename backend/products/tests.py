import io
from PIL import Image
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product

User = get_user_model()

class ProductAPITests(APITestCase):
    def setUp(self):
        # user จำลอง
        self.seller = User.objects.create_user(username="seller1", email="s1@test.com", password="password", role="seller")
        self.buyer = User.objects.create_user(username="buyer1", email="b1@test.com", password="password", role="buyer")
        
        # Mock Image - เปลี่ยนการบันทึก Object ให้ผ่าน SimpleUploadedFile ป้องกัน AttributeError
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.seek(0)
        
        self.mock_image = SimpleUploadedFile(
            name='test_product.png',
            content=file.read(),
            content_type='image/png'
        )

        # สร้างสินค้า
        self.product = Product.objects.create(
            title="Old Product",
            description="Test details",
            price=150.00,
            quantity=10,
            image=self.mock_image,
            seller=self.seller
        )
        
        # เปลี่ยนเป็นระบุ URL Path แบบตรงๆ
        self.list_create_url = '/api/products/'
        self.detail_url = f'/api/products/{self.product.pk}/'

    def test_get_products_anonymous(self):
        """ดูสินค้าแบบไม่ได้ล็อคอิน"""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_product_authenticated(self):
        """เพิ่มสินค้าหลังล็อคอิน"""
        self.client.force_authenticate(user=self.seller)
        
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(0, 155, 0))
        image.save(file, 'png')
        file.seek(0)
        new_mock_image = SimpleUploadedFile(
            name='new_product.png',
            content=file.read(),
            content_type='image/png'
        )

        data = {
            "title": "New Gadget",
            "description": "Awesome specification",
            "price": 450.00,
            "quantity": 5,
            "image": new_mock_image
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(Product.objects.latest('id').seller, self.seller)

    def test_create_product_unauthenticated_forbidden(self):
        """ถ้าไม่ได้ล็อคอินเพิ่มสินค้าไม่ได้"""
        data = {"title": "Ghost Item", "price": 100, "quantity": 1}
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)