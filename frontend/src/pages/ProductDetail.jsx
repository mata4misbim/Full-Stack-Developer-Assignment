import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../api";

function ProductDetail() {
  const { id } = useParams(); // ดึง ID ออกมาจาก URL พาท
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}/`);
        if (!response.ok) throw new Error("ไม่พบสินค้ารายการนี้");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนครับ!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      if (!response.ok) throw new Error("เพิ่มลงตะกร้าล้มเหลว");
      alert("✨ เพิ่มสินค้าลงตะกร้าเรียบร้อย!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading)
    return (
      <h2 className="text-center text-xl font-bold mt-12 text-gray-700">
        🔍 กำลังเปิดดูรายละเอียดสินค้า...
      </h2>
    );
  if (!product)
    return (
      <h2 className="text-center text-xl text-red-500 mt-12">
        ❌ ไม่พบสินค้าที่คุณต้องการ
      </h2>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/"
        className="text-indigo-600 hover:text-indigo-800 font-semibold mb-6 inline-block"
      >
        ⬅️ กลับหน้าร้านค้า
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-gray-100">
        {/* ฝั่งรูปภาพ */}
        <div className="w-full h-80 md:h-96 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">ไม่มีรูปภาพสินค้า</span>
          )}
        </div>

        {/* ฝั่งข้อมูล */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
              ผู้ขาย: {product.seller_username}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-4">
              {product.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div>
            <div className="text-3xl font-black text-emerald-500 mb-6">
              ฿{parseFloat(product.price).toLocaleString()}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-orange-600 transition-colors active:scale-98 duration-100 shadow-md"
            >
              🛒 เพิ่มลงตะกร้าสินค้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
