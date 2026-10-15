import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Deals from "./pages/Deals";
import BestSellers from "./pages/BestSellers";
import AIShopping from "./pages/AIShopping";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import EditProduct from "./pages/admin/EditProduct";
import Users from "./pages/admin/Users";
import UserDetails from "./pages/admin/UserDetails";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* User */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

  <Route
    path="/ai-shopping"
    element={<AIShopping />}
  />
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

  <Route
    path="/products/:id"
    element={<ProductDetails />}
  />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/deals"
          element={<Deals />}
        />

        <Route
          path="/best-sellers"
          element={<BestSellers />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* User Profile */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />

        </Route>

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute adminOnly={true} />
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/products"
            element={<ManageProducts />}
          />

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
            path="/admin/users/:id"
            element={<UserDetails />}
          />

        </Route>

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;





