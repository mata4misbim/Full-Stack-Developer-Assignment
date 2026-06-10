import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

function ProductCard({ product, onAddToCart }) {
  // เช็คว่ามีสินค้าไหม
  const isOutOfStock = product.quantity === 0;

  return (
    <div className="group flex flex-col bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
      {/* รูปสินค้า */}
      <Link
        to={`/products/${product.id}`}
        className="block relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4"
      >
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
            ไม่มีรูปภาพ
          </div>
        )}

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full">
              สินค้าหมด
            </span>
          </div>
        )}
      </Link>

      {/* ข้อมูลสินค้า */}
      <div className="px-1 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-3 line-clamp-2 h-8">
            {product.description || "ไม่มีคำอธิบาย"}
          </p>
        </Link>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-3">
            <span className="text-lg font-black text-emerald-600">
              ฿{parseFloat(product.price).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              เหลือ {product.quantity} ชิ้น
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product.id)}
            disabled={isOutOfStock}
            className={`w-full font-bold py-3 rounded-xl transition-all text-sm ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
            }`}
          >
            {isOutOfStock ? "สินค้าหมด" : "ใส่ตะกร้า"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
