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
  setQuantity,
  description,
  setDescription,
  setImage,
  saveLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* ปุ่มปิด */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {editMode ? "แก้ไขสินค้า" : "ลงขายสินค้าใหม่"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editMode
              ? "ปรับปรุงข้อมูลให้เป็นปัจจุบัน"
              : "กรอกข้อมูลเพื่อนำสินค้าขึ้นหน้าร้าน"}
          </p>
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={onSubmit} className="space-y-5">
          {[
            {
              label: "ชื่อสินค้า",
              value: title,
              setter: setTitle,
              type: "text",
              placeholder: "เช่น เสื้อยืดมินิมอล",
            },
            {
              label: "ราคา (บาท)",
              value: price,
              setter: setPrice,
              type: "number",
              placeholder: "0.00",
            },
            {
              label: "จำนวนในสต็อก",
              value: quantity,
              setter: setQuantity,
              type: "number",
              placeholder: "0",
            },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                {field.label}
              </label>
              <input
                type={field.type}
                required
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
              />
            </div>
          ))}

          {/* Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              รายละเอียด
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="บอกรายละเอียดเพิ่มเติมให้ลูกค้าตัดสินใจง่ายขึ้น..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
              รูปภาพสินค้า
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-colors cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saveLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl transition-all text-sm"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className={`flex-1 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-sm ${
                editMode
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              {saveLoading
                ? "กำลังบันทึก..."
                : editMode
                  ? "บันทึกการแก้ไข"
                  : "ลงขายสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
