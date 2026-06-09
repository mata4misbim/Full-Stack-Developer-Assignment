from django.urls import path
from .views import ProductListCreateView
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [
    # เส้นทางหลักสำหรับ ดูสินค้าทั้งหมด และ เพิ่มสินค้าใหม่
    path('', ProductListCreateView.as_view(), name='product-list-create'),

    # เพิ่มเส้นทางนี้เข้าไป: ส่องรายละเอียด, แก้ไข, ลบ สินค้าแบบเจาะจงรายชิ้น (ตาม ID)
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]