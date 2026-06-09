from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    # ดึงรายละเอียดสินค้าแบบเต็มๆ มาโชว์ในตะกร้าด้วยเลย
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'buyer', 'product', 'product_details', 'quantity']
        read_only_fields = ['buyer', 'product_details']