from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from django.db import transaction  # transaction ไว้เช็คสต๊อก
from products.models import Product

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated] # ต้องล็อกอินถึงจะสั่งซื้อได้

    def get_queryset(self):
        # ดูประวัติใบสั่งซื้อเฉพาะของตัวเองเท่านั้น
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        buyer = request.user
        # 1. ดึงไอเทมทั้งหมดในตะกร้าของ User คนนี้ออกมา
        cart_items = CartItem.objects.filter(buyer=buyer)

        if not cart_items.exists():
            return Response({"error": "ไม่มีสินค้าในตะกร้า ไม่สามารถสั่งซื้อได้"}, status=status.HTTP_400_BAD_REQUEST)

        # Use an atomic transaction and lock product rows to avoid race conditions
        with transaction.atomic():
            order = Order.objects.create(buyer=buyer, total_price=0.00)
            total_price = 0

            # iterate cart items and lock corresponding product rows
            for item in cart_items.select_related('product'):
                locked_product = Product.objects.select_for_update().get(pk=item.product.pk)

                if locked_product.quantity < item.quantity:
                    return Response({"error": f"ขออภัยครับ สินค้า '{locked_product.title}' คงเหลือในคลังไม่พอ (เหลือเพียง {locked_product.quantity} ชิ้น)"}, status=status.HTTP_400_BAD_REQUEST)

                item_total = locked_product.price * item.quantity
                total_price += item_total

                OrderItem.objects.create(order=order, product=locked_product, quantity=item.quantity, unit_price=locked_product.price)

                locked_product.quantity -= item.quantity
                locked_product.save()

            order.total_price = total_price
            order.save()
            cart_items.delete()

        # ส่งข้อมูลบิลที่สร้างสำเร็จกลับไปให้หน้าบ้านโชว์ความสำเร็จ
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)