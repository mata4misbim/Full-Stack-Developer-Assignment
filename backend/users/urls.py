from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # 📝 เส้นทางสมัครสมาชิก
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # 🔑 เส้นทางล็อกอิน (ใช้ JWT Token รับส่งรหัสผ่านความปลอดภัยสูง)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]