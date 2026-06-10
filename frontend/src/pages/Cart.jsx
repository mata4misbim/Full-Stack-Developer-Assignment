import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";
import CartProductCard from "../components/CartProductCard";

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

  // ฟังก์ชันสำหรับอัปเดตจำนวนชิ้นสินค้า
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("access_token");

    const targetItem = cartItems.find((item) => item.id === cartItemId);
    if (!targetItem) return;

    // ดึง product_id
    const productId = targetItem.product || targetItem.product_details?.id;

    try {
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "POST", // อัพเดททุกฟิล
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      if (!response.ok)
        throw new Error("หลังบ้านไม่อนุญาตให้แก้ไขจำนวนด้วยวิธีนี้");

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
      alert("สั่งซื้อสินค้าสำเร็จเรียบร้อยครับ!");
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
          ยังไม่ได้เข้าสู่ระบบ
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
        กำลังเปิดดูตะกร้าสินค้า...
      </h2>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header สไตล์สะอาดตา */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          ตะกร้าสินค้าของคุณ
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          {cartItems.length} รายการที่กำลังรอการชำระเงิน
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-slate-400 text-lg mb-6">
            ไม่มีสินค้าอยู่ในตะกร้าในขณะนี้
          </p>
          <Link
            to="/"
            className="inline-block bg-slate-900 text-white font-bold px-8 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
          >
            เลือกซื้อสินค้าเพิ่ม
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ลูปการ์ดสินค้า */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
              >
                <CartProductCard
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              </div>
            ))}
          </div>

          {/* สรุปบิลยอดรวม */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit space-y-6 self-start sticky top-24">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-slate-500">
                <span>ราคารวมสินค้า</span>
                <span className="font-semibold text-slate-900">
                  ฿{calculateTotal().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">
                  ยอดชำระทั้งสิ้น
                </span>
                <span className="text-2xl font-black text-emerald-600">
                  ฿{calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              ดำเนินการชำระเงิน
            </button>

            <p className="text-[10px] text-center text-slate-400">
              * ข้อมูลการสั่งซื้อจะถูกบันทึกและตัดสต็อกสินค้าทันที
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
