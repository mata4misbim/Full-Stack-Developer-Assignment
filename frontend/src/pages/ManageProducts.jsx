import { useState, useEffect } from "react";
import { BASE_URL } from "../api";
import ProductModal from "../components/ProductModal";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

function ManageProducts() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State ควบคุมป๊อปอัป
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // State เก็บค่าข้อมูลฟอร์ม (เพิ่ม quantity สต็อกสินค้า)
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(""); // State สต็อก
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("access_token");
      const currentUsername = localStorage.getItem("username");

      if (!token || !currentUsername) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/products/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("ดึงข้อมูลสินค้าหน้าร้านไม่สำเร็จ");
        const data = await response.json();

        const filteredProducts = data.filter((product) => {
          const sellerName =
            product.seller_username || product.owner || product.seller;
          return sellerName === currentUsername;
        });

        setMyProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching seller products:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setQuantity(""); // รีเซ็ตค่าสต็อก
    setDescription("");
    setImage(null);
    setSelectedProductId(null);
    setEditMode(false);
    setIsModalOpen(false);
  };

  const handleEditClick = (product) => {
    setEditMode(true);
    setSelectedProductId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setQuantity(product.quantity || 0); // ดึงค่าจำนวนสต็อกเดิมมาใส่ฟอร์มแก้
    setDescription(product.description || "");
    setImage(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert(
        "เซสชันหมดอายุหรือคุณยังไม่ได้เข้าสู่ระบบ กรุณา Login ใหม่ก่อนครับ",
      );
      return;
    }

    // ใช้ FormData เพื่อยิงข้อมูลและไฟล์ภาพ
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", Number(price));
    formData.append("quantity", Number(quantity)); //ส่งค่าจำนวนสินค้าไปให้ Django
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    const url = editMode
      ? `${BASE_URL}/api/products/${selectedProductId}/`
      : `${BASE_URL}/api/products/`;

    const method = editMode ? "PATCH" : "POST";

    try {
      setSaveLoading(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);

        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

        throw new Error(errorMessages || "เกิดข้อผิดพลาดในการส่งข้อมูล");
      }

      alert(
        editMode
          ? "อัปเดตข้อมูลสินค้าเรียบร้อย!"
          : "เพิ่มสินค้าใหม่เข้าหน้าร้านสำเร็จ!",
      );
      resetForm();

      // Refresh products list
      const refreshToken = localStorage.getItem("access_token");
      const refreshUsername = localStorage.getItem("username");
      try {
        const refreshResp = await fetch(`${BASE_URL}/api/products/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (refreshResp.ok) {
          const refreshData = await refreshResp.json();
          const filteredProducts = refreshData.filter(
            (p) => p.seller_username === refreshUsername,
          );
          setMyProducts(filteredProducts);
        }
      } catch (e) {
        console.error("Error refreshing products:", e);
      }
    } catch (error) {
      alert(`ลงขายไม่ได้เนื่องจาก:\n${error.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("แน่ใจนะว่าจะลบสินค้าชิ้นนี้ออกจากหน้าร้าน?")) return;
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("ลบสินค้าล้มเหลว");

      setMyProducts(myProducts.filter((p) => p.id !== productId));
      alert("ลบสินค้าออกจากระบบเรียบร้อยครับ!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header สไตล์สะอาดตา */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            คลังสินค้าของคุณ
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            จัดการสต็อกและข้อมูลสินค้าทั้งหมดในร้าน
          </p>
        </div>
        <button
          onClick={() => {
            setEditMode(false);
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          + ลงขายสินค้าใหม่
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold">
          กำลังโหลดคลังสินค้า...
        </div>
      ) : myProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-400 text-lg">ยังไม่มีสินค้าในคลัง</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-6">สินค้า</th>
                  <th className="p-6">ราคา</th>
                  <th className="p-6">สต็อก</th>
                  <th className="p-6 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                        {product.image ? (
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                            ไม่มีรูป
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ฿{parseFloat(product.price).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-bold text-xs">
                        {product.quantity || 0} ชิ้น
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-black py-2.5 px-4 rounded-xl transition-all"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black py-2.5 px-4 rounded-xl transition-all"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ส่ง Props สต็อกเพิ่มเติมเข้าป๊อปอัปแชร์ฟอร์ม */}
      <ProductModal
        isOpen={isModalOpen}
        editMode={editMode}
        onClose={resetForm}
        onSubmit={handleFormSubmit}
        title={title}
        setTitle={setTitle}
        price={price}
        setPrice={setPrice}
        quantity={quantity} // ส่งสิทธิ์รับค่าสต็อกเข้า Modal
        setQuantity={setQuantity} // ส่งฟังก์ชันแก้ไขค่าสต็อกเข้า Modal
        description={description}
        setDescription={setDescription}
        setImage={setImage}
        saveLoading={saveLoading}
      />
    </div>
  );
}

export default ManageProducts;
