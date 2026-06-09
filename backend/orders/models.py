from django.db import models
from django.conf import settings
from products.models import Product

# ตารางหลัก: ใบเสร็จใบใหญ่ 1 ใบ
class Order(models.Model):
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2) # ราคารวมทั้งหมดของออเดอร์นี้
    created_at = models.DateTimeField(auto_now_add=True) # วันเวลาที่กดยืนยันคำสั่งซื้อ

    def __str__(self):
        return f"Order #{self.id} by {self.buyer.username}"

# ตารางย่อย: รายการแถวสินค้าข้างในใบเสร็จ (1 Order มีได้หลาย OrderItem)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # จุดสำคัญ: ใช้ models.SET_NULL และ null=True 
    # ความหมายคือ ถ้าในอนาคตคนขายลบสินค้านี้ทิ้ง ประวัติการซื้อในใบเสร็จของลูกค้าจะต้องไม่หายไป! แค่เปลี่ยนชื่อเป็นว่างเปล่า
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # บันทึกราคา ณ วินาทีที่ซื้อจริง (ป้องกันปัญหาคนขายเนียนขึ้นราคาสินค้าทีหลังแล้วประวัติเก่าเพี้ยน)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.title if self.product else 'Unknown Product'} x {self.quantity}"