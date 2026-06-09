from django.db import models
from django.conf import settings
from products.models import Product  # ดึงโมเดลสินค้าจากอีก App มาเชื่อมความสัมพันธ์

class CartItem(models.Model):
    # 1. ใครเป็นคนกดของชิ้นนี้ใส่ตะกร้า? (เชื่อมไปตาราง User)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    
    # 2. ของที่กดเข้ามาคือสินค้าชิ้นไหน? (เชื่อมไปตาราง Product)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    # 3. สั่งไอเทมนี้จำนวนกี่ชิ้นในตะกร้า? (ตั้งค่าเริ่มต้นไว้ที่ 1 ชิ้น)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.buyer.username} - {self.product.title} ({self.quantity})"