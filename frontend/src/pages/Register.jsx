// src/pages/Register.jsx
import React, { useState } from "react";
import { BASE_URL } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const getErrorMessage = (data) => {
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    return Object.entries(data)
      .map(([field, messages]) => {
        const message = Array.isArray(messages)
          ? messages.join(", ")
          : messages;
        return `${field}: ${message}`;
      })
      .join("\n");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ถ้าแบคเอนด์ส่ง Error กลับมา (เช่น Username/Email ซ้ำ) ให้พ่นแจ้งเตือน
        throw new Error(
          getErrorMessage(data) || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        );
      }

      alert("🎉 สมัครสมาชิกสำเร็จแล้วครับ! ยินดีต้อนรับสู่ StoreFront");
      window.location.href = "/login"; // สมัครเสร็จปุ๊บ ส่งไปหน้าล็อกอินทันที
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            📝 สมัครสมาชิกใหม่
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ร่วมเป็นส่วนหนึ่งกับ StoreFront Marketplace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="เช่น methachobmee"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="oh@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ประเภทบัญชี (Role)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="buyer">Buyer (ผู้ซื้อสินค้า)</option>
                <option value="seller">Seller (ผู้ขายสินค้า)</option>
              </select>
            </div>
          </div>

          {/* ปุ่มกดส่ง */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              ยืนยันการสมัครสมาชิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
