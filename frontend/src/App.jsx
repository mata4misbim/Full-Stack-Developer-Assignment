import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import OrderHistory from "./pages/OrderHistory";
import ManageProducts from "./pages/ManageProducts";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        {/*เพิ่มเส้นทางแบบ Dynamic Param ด้วย :id */}
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/seller/manage" element={<ManageProducts />} />
      </Routes>
    </Router>
  );
}

export default App;
