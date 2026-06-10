import { useState, useEffect } from "react";
import { BASE_URL } from "../api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/orders/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("ดึงข้อมูลประวัติการสั่งซื้อไม่สำเร็จ");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const token = localStorage.getItem("access_token");

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl shadow border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          🔒 กรุณาเข้าสู่ระบบ
        </h2>
        <p className="text-gray-500">
          คุณต้องเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อของคุณ
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <h2 className="text-center text-xl font-bold mt-12 text-gray-700">
        📦 กำลังโหลดประวัติการสั่งซื้อ...
      </h2>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        🧾 ประวัติการสั่งซื้อของคุณ
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-lg">
            คุณยังไม่เคยมีประวัติการสั่งซื้อสินค้า
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
              {/* หัวบิล */}
              <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-2">
                <div>
                  <span className="text-sm text-gray-400">เลขที่ออเดอร์:</span>
                  <span className="font-mono font-bold text-gray-900 ml-1">
                    #{order.id}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "ไม่ระบุวันที่"}
                  </span>
                  <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {order.status || "รอดำเนินการ"}
                  </span>
                </div>
              </div>

              {/* รายการสินค้าในบิลนั้นๆ (ถ้าแบคเอนด์ส่งมาเป็น Nested Array) */}

              {order.items && order.items.length > 0 && (
                <div className="divide-y divide-gray-100 bg-gray-50 rounded-lg p-3 space-y-2">
                  {order.items.map((item) => {
                    // 🎯 เจาะเข้าก้อนข้อมูลหลักที่แบคเอนด์ส่งมา
                    const details = item.product_details || {};

                    // 🎯 ดึงข้อมูลชื่อสินค้า และราคาต่อชิ้นให้ถูกตัว
                    const title = details.title || "สินค้าไม่ระบุชื่อ";
                    const price = parseFloat(
                      details.price || item.unit_price || 0,
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between py-2 text-sm text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          {/* แสดงชื่อสินค้าจริงตามตาราง Object */}
                          <span className="font-medium text-gray-900">
                            {title}
                          </span>
                          <span className="text-gray-400 text-xs">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {/* คำนวณราคารวมของไอเทมชิ้นนี้ (ราคา x จำนวน) */}฿
                          {(price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ยอดรวมท้ายบิล */}
              <div className="flex justify-end items-center gap-2 pt-2 border-t">
                <span className="text-gray-500 text-sm">ราคารวมทั้งหมด:</span>
                <span className="text-xl font-black text-indigo-600">
                  ฿{parseFloat(order.total_price || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
