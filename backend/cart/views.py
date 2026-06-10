from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import CartItem
from .serializers import CartItemSerializer
from products.models import Product

class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated] # ต้องล็อกอินเท่านั้นถึงจะยุ่งกับตะกร้าได้

    def get_queryset(self):
        # ดึงเฉพาะไอเทมในตะกร้าที่เป็นของตัวเราเอง (คนที่ล็อกอินอยู่)
        return CartItem.objects.filter(buyer=self.request.user)

    def create(self, request, *args, **kwargs):
        # custom create: if item exists, increment quantity; else create new
        buyer = request.user
        product = request.data.get("product_id")
        try:
            product_obj = Product.objects.get(pk=product)
        except Product.DoesNotExist:
            return Response({"error": "ไม่พบสินค้าที่ต้องการ"}, status=status.HTTP_400_BAD_REQUEST)

        qty = int(request.data.get("quantity", 1))
        if qty <= 0:
            return Response({"error": "จำนวนสินค้าต้องมากกว่า 0"}, status=status.HTTP_400_BAD_REQUEST)

        # find existing cart item
        cart_item, created = CartItem.objects.get_or_create(buyer=buyer, product=product_obj, defaults={"quantity": 0})

        # check stock (do not allow adding more than available)
        if cart_item.quantity + qty > product_obj.quantity:
            return Response({"error": f"สต็อกไม่พอ สำหรับสินค้า '{product_obj.title}' (เหลือ {product_obj.quantity} ชิ้น)"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity += qty
        cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """รองรับการดู/แก้ไข/ลบ CartItem ทีละรายการ (PATCH เพื่อปรับ quantity)"""
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(buyer=self.request.user)

    def update(self, request, *args, **kwargs):
        # allow updating quantity directly (replace)
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        qty = request.data.get('quantity')
        if qty is None:
            return super().update(request, *args, **kwargs)

        try:
            qty = int(qty)
        except (TypeError, ValueError):
            return Response({"error": "จำนวนสินค้าต้องเป็นตัวเลข"}, status=status.HTTP_400_BAD_REQUEST)

        if qty < 0:
            return Response({"error": "จำนวนต้องไม่ติดลบ"}, status=status.HTTP_400_BAD_REQUEST)

        # check stock
        if qty > instance.product.quantity:
            return Response({"error": f"สต็อกไม่พอ สำหรับสินค้า '{instance.product.title}' (เหลือ {instance.product.quantity} ชิ้น)"}, status=status.HTTP_400_BAD_REQUEST)

        instance.quantity = qty
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Note: detailed retrieve/update/delete is provided by CartItemDetailView above.