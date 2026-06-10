import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  // เช็คโทเค่นสำหรับเช็คสถานะการเข้าสู่ระบบ
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    alert("ออกจากระบบเรียบร้อย!");

    // เปลี่ยนมาใช้ดีไซน์ฝั่ง React Router แทนการยิง window.location เพื่อความลื่นไหล
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 font-sans tracking-wide sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* โลโก้ */}
        <Link
          to="/"
          className="text-xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          StoreFront
        </Link>

        {/* เมนู */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-300 hover:text-emerald-400 transition-colors duration-200"
          >
            หน้าแรก
          </Link>

          <Link
            to="/cart"
            className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">ตะกร้า</span>
          </Link>

          {/* เมนูสำหรับคนที่ล็อคอินแล้ว */}
          {isLoggedIn && (
            <>
              <Link
                to="/orders"
                className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">ประวัติสั่งซื้อ</span>
              </Link>
              <Link
                to="/seller/manage"
                className="text-slate-300 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">จัดการหน้าร้าน</span>
              </Link>
            </>
          )}

          <span className="h-4 w-1px bg-slate-800 hidden sm:block"></span>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-rose-950/40 hover:bg-rose-900 text-rose-400 border border-rose-900/50 hover:border-rose-700 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="text-slate-400 hover:text-slate-200 transition-colors duration-200 text-xs"
              >
                สมัครสมาชิก
              </Link>
              <Link
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold px-4 py-1.5 rounded-xl text-xs shadow-md shadow-emerald-900/20 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
