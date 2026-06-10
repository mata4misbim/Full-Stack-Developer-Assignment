// src/pages/ProductDetail.jsx (ตัวอย่างการปรับปรุง)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}/`);
        if (!response.ok) throw new Error("ไม่พบข้อมูลสินค้านี้");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // 💡 ดักจับความปลอดภัยหน้าบ้านอีกชั้น: ถ้าของหมดคลัง ไม่ให้ทำลอจิกแอดของ
    if (product?.quantity === 0) {
      alert("⚠️ สินค้าชิ้นนี้หมดสต็อกแล้วครับ ไม่สามารถเพิ่มลงตะกร้าได้");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("🔒 กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้าครับ");
      navigate("/login");
      return;
    }

    try {
      setIsAdding(true);
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });

      if (!response.ok) throw new Error("เพิ่มเข้าตะกร้าไม่สำเร็จ");
      alert("🛒 เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading)
    return <h2 className="text-center mt-10">กำลังโหลดรายละเอียดสินค้า...</h2>;
  if (!product)
    return (
      <h2 className="text-center mt-10 text-red-500">ไม่พบสินค้านี้ในระบบ</h2>
    );

  // 💡 เช็คว่าสินค้าหมดคลังหรือไม่
  const isOutOfStock = product.quantity === 0 || product.quantity === undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* ฝั่งรูปภาพ */}
        <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        {/* ฝั่งข้อมูลรายละเอียด */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-emerald-600 mb-4">
              ฿{parseFloat(product.price).toLocaleString()}
            </p>

            {/* 🎯 จุดที่ 1: แสดงจำนวนสต็อกคงเหลือ */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-100">
                  🚫 สินค้าหมดชั่วคราว
                </span>
              ) : (
                <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
                  📦 คงเหลือในคลัง: {product.quantity} ชิ้น
                </span>
              )}
            </div>

            <hr className="border-gray-100 mb-4" />
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description ||
                "ไม่มีคำอธิบายรายละเอียดสำหรับสินค้าชิ้นนี้"}
            </p>
          </div>

          {/* 🎯 จุดที่ 2: ดักจับปุ่ม Add To Cart */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding} // 💡 ถ้าของหมด หรือกำลังกดแอด ให้ปิดปุ่ม (disabled)
              className={`w-full font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" // สไตล์ตอนของหมด
                  : "bg-emerald-600 hover:bg-emerald-700 text-white" // สไตล์ตอนปกติ
              }`}
            >
              {isAdding
                ? "⏳ กำลังเพิ่มลงตะกร้า..."
                : isOutOfStock
                  ? "❌ สินค้าหมดสต็อก"
                  : "🛒 เพิ่มลงตะกร้าสินค้า"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
