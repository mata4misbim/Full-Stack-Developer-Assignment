from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from django.db import transaction  # transaction ไว้เช็คสต๊อก

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

        # transaction.atomic logic หักสต๊อก
        with transaction.atomic():
            
            # ลูปสินค้าก่อน เผื่อหมดตอนกำลังซื้อ ---
            for item in cart_items:
                product = item.product
                
                # ถ้าสินค้าไม่มี หรือสต็อกเหลือน้อยกว่าจำนวนที่ลูกค้าจะซื้อ ให้โชว์ error
                if product.quantity is None or product.quantity < item.quantity:
                    return Response(
                        {"error": f"ขออภัยครับ สินค้า '{product.title}' คงเหลือในคลังไม่พอ (เหลือเพียง {product.quantity or 0} ชิ้น)"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # เช็คแล้วหักสต๊อก ---
            # สร้างใบสั่งซื้อหลักขึ้นมารอก่อน (ตั้งยอดเงินเริ่มต้นเป็น 0)
            order = Order.objects.create(buyer=buyer, total_price=0.00)
            total_price = 0

            # ย้ายของจากตะกร้าเข้ามาในบิลใบสั่งซื้อ ยิงลูปทีละชิ้น
            for item in cart_items:
                product = item.product
                
                item_total = product.price * item.quantity
                total_price += item_total

                # บันทึกข้อมูลลงตารางรายการสินค้าในบิล (OrderItem)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item.quantity,
                    unit_price=product.price
                )

                #สกัดจุดหักสต็อก: ทำการลดจำนวนสินค้าในสต็อกตามที่ลูกค้ากดสั่งซื้อจริง
                product.quantity -= item.quantity
                product.save() # เซฟจำนวนสต็อกใหม่ลงฐานข้อมูลหลังบ้าน

            #อัปเดตยอดรวมราคาสุทธิที่แท้จริงลงในบิลหลัก
            order.total_price = total_price
            order.save()

            # สั่งล้างข้อมูลในตะกร้าสินค้าของ User คนนี้ให้เกลี้ยง (เพราะซื้อและตัดสต็อกเรียบร้อยแล้ว)
            cart_items.delete()

        # ส่งข้อมูลบิลที่สร้างสำเร็จกลับไปให้หน้าบ้านโชว์ความสำเร็จ
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)