import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl p-4 text-center shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      {/* โซนเนื้อหาคลิกที่รูปหรือชื่อเพื่อวาร์ปไปหน้ารายละเอียดตาม ID */}
      <Link to={`/products/${product.id}`} className="group cursor-pointer">
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <span className="text-gray-400 text-sm">ไม่มีรูปภาพ</span>
          )}
        </div>
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm my-1 h-10 overflow-hidden line-clamp-2">
          {product.description}
        </p>
      </Link>

      <div className="mt-2">
        <h4 className="text-xl font-bold text-emerald-500 mb-1">
          ฿{parseFloat(product.price).toLocaleString()}
        </h4>
        <p className="text-xs text-gray-400 mb-3">
          ผู้ขาย: {product.seller_username}
        </p>

        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors active:scale-95 duration-100"
        >
          ใส่ตะกร้า
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
