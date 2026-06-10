import { useState, useEffect } from "react";
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
    // ถ้าของหมดแอดไม่ได้
    if (product?.quantity === 0) {
      alert("สินค้าชิ้นนี้หมดสต็อกแล้วครับ ไม่สามารถเพิ่มลงตะกร้าได้");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้าครับ");
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
      alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!");
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

  // เช็คว่าสินค้าหมดคลังไหม
  const isOutOfStock = product.quantity === 0 || product.quantity === undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* รูปภาพ */}
        <div className="sticky top-24">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                ไม่มีรูปภาพ
              </div>
            )}
          </div>
        </div>

        {/* รายละเอียด */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              {product.title}
            </h1>
            <p className="text-3xl font-black text-emerald-600 mb-6">
              ฿{parseFloat(product.price).toLocaleString()}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {isOutOfStock
                  ? "สินค้าหมด"
                  : `เหลือในคลัง: ${product.quantity} ชิ้น`}
              </span>
            </div>

            <div className="prose prose-slate max-w-none">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-2">
                รายละเอียดสินค้า
              </h4>
              <p className="text-slate-500 leading-relaxed text-lg">
                {product.description ||
                  "ไม่มีคำอธิบายรายละเอียดสำหรับสินค้าชิ้นนี้"}
              </p>
            </div>
          </div>

          {/* AddToCart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`w-full font-black py-5 rounded-2xl shadow-lg transition-all text-lg ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-emerald-600/20 active:scale-[0.98]"
            }`}
          >
            {isAdding
              ? "กำลังเพิ่มลงตะกร้า..."
              : isOutOfStock
                ? "สินค้าหมดสต็อก"
                : "ใส่ตะกร้าสินค้า"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
