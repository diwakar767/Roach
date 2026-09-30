import {BrowserRouter, Routes, Route} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Forgot from "./pages/auth/Forgot";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Layout from "./components/layout/Layout";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import AddProduct from "./pages/addProduct/AddProduct";
import ProductDetail from "./components/product/productDetail/ProductDetail";
import EditProduct from "./pages/editProduct/EditProduct";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Contact from "./pages/contact/Contact";
import ShopGate from "./components/protect/ShopGate";
import Scan from "./pages/scan/Scan";
import Stock from "./pages/stock/Stock";
import Checkout from "./pages/checkout/Checkout";
import Reports from "./pages/reports/Reports";
import InvoiceDetail from "./pages/reports/InvoiceDetail";
import Admin from "./pages/admin/Admin";
import Blocked from "./pages/access/Blocked";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response && error.response.data && error.response.data.message;
    if (error.response && error.response.status === 403 && message === "Account access is paused") {
      if (window.location.pathname !== "/blocked") {
        window.location.assign("/blocked");
      }
    }
    return Promise.reject(error);
  }
);

const shopPage = (page, adminOnly = false) => (
  <ShopGate adminOnly={adminOnly}>
    <Sidebar>
      <Layout>
        {page}
      </Layout>
    </Sidebar>
  </ShopGate>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status))
    }
    loginStatus();
  }, [dispatch]);
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/resetpassword/:resetToken" element={<Reset />} />
        <Route path="/blocked" element={<Blocked />} />

        <Route path="/dashboard" element={shopPage(<Dashboard />)} />
        <Route path="/add-product" element={shopPage(<AddProduct />)} />
        <Route path="/product-detail/:id" element={shopPage(<ProductDetail />)} />
        <Route path="/edit-product/:id" element={shopPage(<EditProduct />)} />
        <Route path="/profile" element={shopPage(<Profile />)} />
        <Route path="/edit-profile" element={shopPage(<EditProfile />)} />
        <Route path="/contact-us" element={shopPage(<Contact />)} />
        <Route path="/scan" element={shopPage(<Scan />)} />
        <Route path="/stock/:id" element={shopPage(<Stock />)} />
        <Route path="/checkout" element={shopPage(<Checkout />)} />
        <Route path="/reports" element={shopPage(<Reports />)} />
        <Route path="/invoice/:id" element={shopPage(<InvoiceDetail />)} />
        <Route path="/admin" element={shopPage(<Admin />, true)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
