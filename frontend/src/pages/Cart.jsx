import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";
import CartProductCard from "../components/CartProductCard"; // 🎯 เรียกใช้การ์ดย่อยที่แยกออกมา

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("ดึงข้อมูลตะกร้าสินค้าไม่สำเร็จ");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // 🛠️ ฟังก์ชันสำหรับอัปเดตจำนวนชิ้นสินค้า (+/-) ยิงไปที่หลังบ้าน
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("access_token");

    // หาข้อมูลไอเทมชิ้นนี้ใน State หน้าบ้านก่อนเพื่อเอา product_id จริงไปยิงส่ง
    const targetItem = cartItems.find((item) => item.id === cartItemId);
    if (!targetItem) return;

    // ดึง product_id ออกมาจากโครงสร้าง (อาจเป็น targetItem.product หรือ targetItem.product_details.id)
    const productId = targetItem.product || targetItem.product_details?.id;

    try {
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "POST", // เปลี่ยนมาใช้ POST แทน PATCH ที่โดนด่า 405
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1, // หรือส่งค่าผลต่างไปให้หลังบ้านคำนวณบวกเพิ่ม
        }),
      });

      if (!response.ok)
        throw new Error("หลังบ้านไม่อนุญาตให้แก้ไขจำนวนด้วยวิธีนี้");

      // ถ้าผ่าน ให้รีเฟรชหรืออัปเดตสถานะหน้าบ้านตามความเหมาะสม
      setCartItems(
        cartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${BASE_URL}/api/cart/${cartItemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("ไม่สามารถลบสินค้าได้");
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("access_token");
    if (cartItems.length === 0) return;

    try {
      const response = await fetch(`${BASE_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("การสั่งซื้อสินค้าล้มเหลว");
      alert("🚀 สั่งซื้อสินค้าสำเร็จเรียบร้อยครับ!");
      setCartItems([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(
        item.product_details?.price || item.unit_price || 0,
      );
      return total + price * item.quantity;
    }, 0);
  };

  const token = localStorage.getItem("access_token");

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          🔒 ยังไม่ได้เข้าสู่ระบบ
        </h2>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700"
        >
          ไปหน้าล็อกอิน
        </Link>
      </div>
    );
  }

  if (loading)
    return (
      <h2 className="text-center text-xl font-bold mt-12 text-gray-700">
        🛒 กำลังเปิดดูตะกร้าสินค้า...
      </h2>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        🛒 ตะกร้าสินค้าของคุณ ({cartItems.length} รายการ)
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg mb-6">
            ไม่มีสินค้าอยู่ในตะกร้าในขณะนี้
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700"
          >
            🛍️ ไปเลือกซื้อสินค้า
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ฝั่งซ้าย: วนลูปเรียกใช้ Component การ์ดแยกชิ้นที่เราเพิ่งสร้าง */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartProductCard
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>

          {/* ฝั่งขวา: สรุปบิลยอดรวมชำระเงิน */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">
              สรุปคำสั่งซื้อ
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ราคารวมสินค้า</span>
              <span className="text-lg font-bold text-gray-900">
                ฿{calculateTotal().toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">ยอดชำระทั้งสิ้น</span>
              <span className="text-2xl font-black text-indigo-600">
                ฿{calculateTotal().toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-100 text-center block"
            >
              💳 ชำระเงินและสั่งซื้อ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
