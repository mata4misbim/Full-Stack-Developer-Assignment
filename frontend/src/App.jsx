import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      {/* วาง Navbar ไว้บนสุดนอก Routes เพื่อให้มันโชว์ในทุกๆ หน้าเว็บ */}
      <Navbar />

      {/* ส่วนควบคุมการสลับหน้าตามพาท URL */}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
