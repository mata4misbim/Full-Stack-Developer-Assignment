from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    # ดึงรายละเอียดสินค้ามาโชว์ในรายการย่อยของบิล
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price_at_purchase']

class OrderSerializer(serializers.ModelSerializer):
    # ดึงรายการสินค้าทั้งหมดที่อยู่ในบิลนี้ออกมาเป็นลิสต์ย่อย
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'total_price', 'status', 'created_at', 'items']
        read_only_fields = ['buyer', 'total_price', 'status']