from django.urls import path
from .views import OrderListCreateView

urlpatterns = [
    # ส้นทางดูประวัติการสั่งซื้อทั้งหมด และ สั่งซื้อสินค้า (Checkout)
    path('', OrderListCreateView.as_view(), name='order-list-create'),
]