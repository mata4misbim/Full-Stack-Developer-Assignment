from rest_framework import serializers

from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_details", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "buyer", "total_price", "created_at", "items"]
        read_only_fields = ["buyer", "total_price", "created_at", "items"]
