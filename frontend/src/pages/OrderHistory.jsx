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
          กรุณาเข้าสู่ระบบ
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
        กำลังโหลดประวัติการสั่งซื้อ...
      </h2>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">
          ประวัติการสั่งซื้อ
        </h1>
        <p className="text-slate-500 mt-2">รายการคำสั่งซื้อย้อนหลังของคุณ</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">📜</div>
          <p className="text-slate-400">ยังไม่มีรายการสั่งซื้อในขณะนี้</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header บิล */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="font-mono font-bold text-slate-900 text-lg">
                    #{order.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-semibold text-slate-900">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                  <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                    {order.status || "Completed"}
                  </span>
                </div>
              </div>

              {/* รายการสินค้า */}
              {order.items && order.items.length > 0 && (
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => {
                    const details = item.product_details || {};
                    const title = details.title || "สินค้าไม่ระบุชื่อ";
                    const price = parseFloat(
                      details.price || item.unit_price || 0,
                    );
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-medium">
                            x{item.quantity}
                          </span>
                          <span className="text-slate-700">{title}</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ฿{(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ยอดรวม */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <span className="text-slate-500 font-medium">ยอดชำระสุทธิ</span>
                <span className="text-2xl font-black text-emerald-600">
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
