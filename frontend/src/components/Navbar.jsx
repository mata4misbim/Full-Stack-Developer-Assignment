// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  // ฟังก์ชันเช็คว่าล็อกอินหรือยัง (ดูว่ามี Token ไหม)
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    alert("ออกจากระบบเรียบร้อยครับ!");
    window.location.href = "/login"; // เด้งไปหน้า login
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#2c3e50",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        🏬 StoreFront
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          หน้าแรก
        </Link>
        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
          🛒 ตะกร้า
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <>
            {/* เพิ่มลิงก์สมัครสมาชิกตรงนี้ */}
            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none" }}
            >
              สมัครสมาชิก
            </Link>
            <Link
              to="/login"
              style={{
                backgroundColor: "#2ecc71",
                color: "white",
                padding: "8px 15px",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
