// src/pages/ProductList.jsx
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลสินค้ามาโชว์ (เหมือนเดิม)
  const fetchProducts = async () => {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🛠️ 2. เพิ่มฟังก์ชันช็อตเด็ด: กดปุ่มแล้วยิงเข้าตะกร้าหลังบ้าน
  const handleAddToCart = async (productId) => {
    // หยิบกุญแจล็อกอินจากเครื่องมาเช็ค
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้าครับ!");
      window.location.href = "/login"; // ไล่ไปหน้าล็อกอินถ้ายังไม่มีกุญแจ
      return;
    }

    try {
      // ยิง POST ไปที่แอป cart ของ Django
      const response = await fetch(`${BASE_URL}/api/cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // แนบ JWT Token ไปยืนยันตัวตน
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1, // บังคับแอดทีละ 1 ชิ้นตามเบสิกฟีเจอร์
        }),
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถเพิ่มสินค้าลงตะกร้าได้");
      }

      alert("✨ เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้วครับ!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        📦 กำลังโหลดสินค้าเด็ดๆ...
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        🛒 StoreFront Market
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <h3 style={{ margin: "15px 0 10px 0", fontSize: "18px" }}>
              {product.title}
            </h3>
            <p
              style={{
                color: "#777",
                fontSize: "14px",
                height: "40px",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>
            <h4
              style={{ color: "#2ecc71", margin: "10px 0", fontSize: "20px" }}
            >
              ฿{parseFloat(product.price).toLocaleString()}
            </h4>
            <p style={{ fontSize: "12px", color: "#aaa" }}>
              ผู้ขาย: {product.seller_username}
            </p>

            {/* 🛠️ ปรับปุ่มตรงนี้ให้ผูกเรียกใช้ฟังก์ชัน handleAddToCart ตอนกด */}
            <button
              onClick={() => handleAddToCart(product.id)}
              style={{
                backgroundColor: "#e67e22", // เปลี่ยนเป็นสีส้มสะดุดตา
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "6px",
                cursor: "pointer",
                width: "100%",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              ➕ ใส่ตะกร้า
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
