import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // (GET) cart for user
  const fetchCartItems = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // (DELETE)
  const handleRemoveItem = async (cartItemId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${BASE_URL}/api/cart/${cartItemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("ไม่สามารถลบสินค้าได้");

      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      alert("🗑️ ลบสินค้าออกจากตะกร้าแล้วครับ");
    } catch (error) {
      alert(error.message);
    }
  };

  // Checkout Mock
  const handleCheckout = async () => {
    const token = localStorage.getItem("access_token");
    if (cartItems.length === 0) return;

    try {
      // POST TO Order backend
      const response = await fetch(`${BASE_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("การสั่งซื้อสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง");

      alert("🚀 สั่งซื้อสินค้าสำเร็จเรียบร้อยครับ! ตะกร้าของคุณถูกเคลียร์แล้ว");
      setCartItems([]); // เซ็ตตระกร้าว่าง
    } catch (error) {
      alert(error.message);
    }
  };

  // คำนวณราคารวมทั้งหมดที่มีในตะกร้า
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.product_price) * item.quantity,
      0,
    );
  };

  const token = localStorage.getItem("access_token");

  // ยังไม่ได้ล็อกอิน
  if (!token) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          🔒 ยังไม่ได้เข้าสู่ระบบ
        </h2>
        <p className="text-gray-500 mb-6">
          กรุณาเข้าสู่ระบบเพื่อเปิดดูและจัดการตะกร้าสินค้าของคุณครับ
        </p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          ไปหน้าล็อกอิน
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <h2 className="text-center text-xl font-bold mt-12 text-gray-700">
        🛒 กำลังเปิดดูตะกร้าสินค้า...
      </h2>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-2">
        🛒 ตะกร้าสินค้าของคุณ ({cartItems.length} รายการ)
      </h1>

      {cartItems.length === 0 ? (
        //ตะกร้าว่างเปล่า
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg mb-6">
            ไม่มีสินค้าอยู่ในตะกร้าในขณะนี้
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            🛍️ ไปเลือกซื้อสินค้าเลย
          </Link>
        </div>
      ) : (
        // มีของในตะกร้า โชว์รายการสินค้า
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* รายการสินค้าในตะกร้า */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* รูปสินค้า */}
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">ไม่มีรูป</span>
                    )}
                  </div>
                  {/* รายละเอียด ชื่อ ราคา จำนวน */}
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">
                      {item.product_title}
                    </h3>
                    <p className="text-sm text-emerald-600 font-semibold mt-0.5">
                      ฿{parseFloat(item.product_price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      จำนวน: {item.quantity} ชิ้น
                    </p>
                  </div>
                </div>

                {/* ปุ่มกดลบไอเทมออกจากตะกร้า */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="ลบสินค้า"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* สรุปบิลยอดชำระเงิน */}
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
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">ค่าจัดส่ง</span>
              <span className="text-emerald-500 font-medium">ฟรี</span>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">ยอดชำระทั้งสิ้น</span>
              <span className="text-2xl font-black text-indigo-600">
                ฿{calculateTotal().toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors active:scale-98 duration-100 text-center block"
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
