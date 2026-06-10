import { BASE_URL } from "../api";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

function CartProductCard({ item, onUpdateQuantity, onRemoveItem }) {
  const details = item.product_details || {};
  const title = details.title || "สินค้าไม่ระบุชื่อ";
  const price = parseFloat(details.price || item.unit_price || 0);
  const image = details.image || item.product_image;

  return (
    <div className="flex items-center gap-5 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-emerald-100 transition-all">
      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{title}</h3>
        <p className="text-sm font-semibold text-emerald-600 mt-1">
          ฿{price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all disabled:opacity-30 font-bold"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-bold text-slate-900">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all font-bold"
          >
            +
          </button>
        </div>

        {/* ปุ่มลบ*/}
        <button
          onClick={() => onRemoveItem(item.id)}
          className="text-slate-300 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
          title="ลบสินค้า"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartProductCard;
