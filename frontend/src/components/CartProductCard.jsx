function CartProductCard({ item, onUpdateQuantity, onRemoveItem }) {
  const details = item.product_details || {};
  const title = details.title || "สินค้าไม่ระบุชื่อ";
  const price = parseFloat(details.price || item.unit_price || 0);
  const image = details.image || item.product_image;

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm items-center justify-between">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* รูปภาพสินค้าจากตู้น้องหมาสุดน่ารัก */}
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">ไม่มีรูป</span>
          )}
        </div>

        {/* รายละเอียด ชื่อ และราคารายชิ้น */}
        <div>
          <h3 className="font-bold text-gray-900 line-clamp-1">{title}</h3>
          <p className="text-sm text-emerald-600 font-semibold mt-0.5">
            ฿{price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* โซนจัดการจำนวนชิ้น และปุ่มลบถังขยะ */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
        {/* 🛠️ ปุ่มปรับเพิ่ม/ลดจำนวนสินค้า */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:hover:bg-transparent font-bold"
          >
            -
          </button>
          <span className="px-4 py-1 text-sm font-semibold text-gray-900 bg-white min-w-[40px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition-colors font-bold"
          >
            +
          </button>
        </div>

        {/* ถังขยะลบไอเทมนี้ออกจากตะกร้า */}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
          title="ลบสินค้า"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CartProductCard;
