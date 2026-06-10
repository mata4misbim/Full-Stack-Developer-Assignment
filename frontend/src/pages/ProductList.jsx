import { useState, useEffect } from "react";
import { BASE_URL } from "../api";
import ProductCard from "../components/ProductCard"; // ดึง Component การ์ดมาใช้

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/`);
        if (!response.ok) throw new Error("ดึงข้อมูลสินค้าไม่สำเร็จ");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้าครับ!");
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
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });

      if (!response.ok) {
        let errMsg = "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้";
        try {
          const data = await response.json();
          errMsg =
            data.detail || data.error || data.message || JSON.stringify(data);
        } catch {
          try {
            errMsg = await response.text();
          } catch {
            /* ignore */
          }
        }
        if (response.status === 401) {
          alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          window.location.href = "/login";
          return;
        }
        throw new Error(errMsg);
      }
      alert("✨ เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้วครับ!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center text-xl font-bold mt-12 text-gray-700">
        📦 กำลังโหลดสินค้าเด็ดๆ...
      </h2>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
        StoreFront Market
      </h1>

      {/* ส่งข้อมูลเข้าไปเจาะลูปในการ์ดแยกชิ้น */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
