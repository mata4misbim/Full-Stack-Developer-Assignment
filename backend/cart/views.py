from rest_framework import generics, permissions
from .models import CartItem
from .serializers import CartItemSerializer

class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated] # ต้องล็อกอินเท่านั้นถึงจะยุ่งกับตะกร้าได้

    def get_queryset(self):
        # ดึงเฉพาะไอเทมในตะกร้าที่เป็นของตัวเราเอง (คนที่ล็อกอินอยู่)
        return CartItem.objects.filter(buyer=self.request.user)

    def perform_create(self, serializer):
        # เวลาแอดของลงตะกร้า ให้ผูกไอดีเราเป็นคนซื้อ (Buyer) โดยอัตโนมัติ
        serializer.save(buyer=self.request.user)

class CartItemDeleteView(generics.DestroyAPIView):
    """ คลาสพิเศษสำหรับให้หน้าบ้านส่งคำสั่งมา 'ลบ' ของออกจากตะกร้าทีละชิ้น """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(buyer=self.request.user)