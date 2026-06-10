from django.urls import path
from .views import CartListCreateView, CartItemDetailView

urlpatterns = [
    # 🛒 เส้นทางหลักสำหรับ ดูของในตะกร้าตัวเราเอง และ แอดของลงตะกร้า
    path('', CartListCreateView.as_view(), name='cart-list-create'),
    
    # ❌ เส้นทางสำหรับส่ง ID มาเพื่อลบของชิ้นนั้นออกจากตะกร้า (เช่น /api/cart/5/)
    path('<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
]