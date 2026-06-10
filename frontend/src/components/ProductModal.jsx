// src/components/ProductModal.jsx
import React from "react";

function ProductModal({
  isOpen,
  editMode,
  onClose,
  onSubmit,
  title,
  setTitle,
  price,
  setPrice,
  quantity,
  setQuantity, // 💡 รับ Props จำนวนสต็อกสินค้าเข้ามาใช้งาน
  description,
  setDescription,
  setImage,
  saveLoading,
}) {
  // ถ้าไม่ได้สั่งเปิดหน้าต่างป๊อปอัป ให้ส่งกลับเป็น null (ซ่อนไว้)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-gray-100 shadow-2xl relative mx-4 animate-fadeIn">
        {/* ปุ่มกากบาทปิดหน้าต่างมุมขวาบน */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg transition-colors"
        >
          ✕
        </button>

        {/* หัวข้อแสดงผลตามโหมดการทำงาน */}
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-900">
            {editMode ? "✏️ แก้ไขข้อมูลสินค้า" : "➕ ลงขายสินค้าใหม่"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {editMode
              ? "แก้ไขรายละเอียดสินค้าของท่านแล้วกดบันทึก"
              : "กรอกข้อมูลให้ครบถ้วนเพื่ออัปเดตเข้าสู่หน้าร้านค้ารวม"}
          </p>
        </div>

        {/* ฟอร์มรับส่งข้อมูล */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. ช่องกรอกชื่อสินค้า */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ชื่อสินค้า *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ชื่อของสินค้าชิ้นนี้"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm text-gray-900"
            />
          </div>

          {/* 2. ช่องกรอกราคาสินค้า */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ราคาสินค้า (บาท) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm text-gray-900"
            />
          </div>

          {/* 3. 🎯 ช่องกรอกจำนวนสินค้าในสต็อก (สกัดจุดบั๊ก quantity: Required) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              จำนวนสินค้าในสต็อก (ชิ้น) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="ใส่จำนวนสินค้า เช่น 10"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm text-gray-900"
            />
          </div>

          {/* 4. ช่องกรอกรายละเอียดสินค้า */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              รายละเอียด
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายข้อมูลของสินค้าชิ้นนี้..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm resize-none text-gray-900"
            />
          </div>

          {/* 5. ช่องอัปโหลดไฟล์รูปภาพ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              รูปภาพสินค้า{" "}
              {editMode && (
                <span className="text-amber-600 font-normal">
                  (ปล่อยว่างไว้ได้ถ้าใช้รูปเดิม)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          {/* กลุ่มปุ่มควบคุม (ยกเลิก / ยืนยัน) */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saveLoading}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className={`w-1/2 text-white font-bold py-2.5 rounded-xl shadow transition-colors text-sm disabled:opacity-50 ${
                editMode
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {saveLoading
                ? "กำลังบันทึก..."
                : editMode
                  ? "💾 บันทึกการแก้ไข"
                  : "🚀 ลงขายสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
