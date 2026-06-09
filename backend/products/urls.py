from django.urls import path
from .views import ProductListCreateView

urlpatterns = [
    # เส้นทางหลักสำหรับ ดูสินค้าทั้งหมด และ เพิ่มสินค้าใหม่
    path('', ProductListCreateView.as_view(), name='product-list-create'),
]