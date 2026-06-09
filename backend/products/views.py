from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-created_at') # เอาสินค้าใหม่ขึ้นก่อน
    serializer_class = ProductSerializer

    def get_permissions(self):
        # ถ้าเป็นการดึงข้อมูลสินค้า (GET) ให้ทุกคนเข้าดูได้เลย
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        # แต่ถ้าเป็นสั่งเพิ่มสินค้า (POST) ต้องล็อกอินเข้าสู่ระบบก่อนเท่านั้น
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        # บันทึกข้อมูลโดยผูกเอาไอดีของคนที่ล็อกอินสั่ง POST อยู่ขณะนั้น เป็นคนขาย (Seller) ทันที
        serializer.save(seller=self.request.user)