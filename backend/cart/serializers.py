from rest_framework import serializers

from .models import CartItem
from products.models import Product
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source="product", read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source="product",
        write_only=True,
    )
    product_title = serializers.ReadOnlyField(source="product.title")
    product_price = serializers.ReadOnlyField(source="product.price")
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "buyer",
            "product",
            "product_id",
            "product_details",
            "product_title",
            "product_price",
            "product_image",
            "quantity",
        ]
        read_only_fields = [
            "buyer",
            "product",
            "product_details",
            "product_title",
            "product_price",
            "product_image",
        ]

    def get_product_image(self, obj):
        if not obj.product.image:
            return None

        image_url = obj.product.image.url
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image_url)
        return image_url
