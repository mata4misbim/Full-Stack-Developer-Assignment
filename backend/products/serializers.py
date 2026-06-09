from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    # ดึงชื่อ username ของคนขายออกมาโชว์แทนที่จะเห็นแค่เลข ID บัตรประชาชนแบคเอนด์
    seller_username = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'quantity', 'image', 'seller', 'seller_username', 'created_at']
        # กำหนดให้ฟิลด์ seller อ่านได้อย่างเดียว เพราะเราจะดึงจากคนที่ล็อกอินเข้ามาสร้างโดยอัตโนมัติ
        read_only_fields = ['seller', 'seller_username']