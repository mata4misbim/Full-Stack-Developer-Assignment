from django.db import models
from django.conf import settings

class Product(models.Model):
    # 1. ข้อมูลพื้นฐานสินค้าตาม User Stories (หัวข้อ, รายละเอียด, ราคา, สต็อก)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # รองรับทศนิยม 2 ตำแหน่งสำหรับค่าเงิน
    quantity = models.PositiveIntegerField()  # จำนวนสต็อกสินค้า ห้ามเป็นค่าติดลบ
    
    # 2. ฟิลด์อัปโหลดรูปภาพ โดยเมื่ออัปโหลดมา รูปจะไปรวมกันอยู่ที่โฟลเดอร์ media/products/
    image = models.ImageField(upload_to='products/')
    
    # 3. จุดสำคัญ: เชื่อมโยงสินค้าชิ้นนี้เข้ากับ 'ผู้ใช้ที่เป็นคนขาย' (User) 
    # models.CASCADE หมายความว่า ถ้าบัญชีผู้ขายโดนลบ สินค้าทั้งหมดของผู้ขายคนนี้จะโดนลบตามไปด้วย
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='products')
    
    # 4. บันทึกเวลาที่ลงขายสินค้าโดยอัตโนมัติ
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title