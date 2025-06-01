import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import AddProductType from "./adminPages/AddProductType";
import ProductDetail from "./productPages/ProductDetail";
import CheckOut from "./productPages/CheckOut";
import Billing from "./productPages/Billing";
import Delivery from "./productPages/Delivery";
import PickUp from "./productPages/PickUp";
import OfferProduct from "./productPages/OfferProduct";
import Home from "./navPages/Home";
import About from "./navPages/About";
import Contact from "./navPages/Contact";
import ProductListMainPage from "./productPages/productList/ProductListMainPage";
import DisplayProducts from "./adminPages/DisplayProducts";
import AddProductCatagorie from "./adminPages/AddProductCatagorie";
import ProductType from "./adminPages/ProductType";
import Favaurite from "./productPages/Favaurite";
import AdminLayout from "./adminPages/AdminLayout";
import AdminHome from "./adminPages/AdminHome";
import AdminProductDetail from "./adminPages/AdminProductDetail";
import ProductUpdate from "./adminPages/ProductUpdate";
import Catagory from "./adminPages/Catagory";
import CatagoryUpdate from "./adminPages/CatagoryUpdate";
import DisplayProductType from "./adminPages/DisplayProductType";
import UpdateProductType from "./adminPages/UpdateProductType";
import DisplayOrders from "./adminPages/orders/DisplayOrders";
import ViewOrder from "./adminPages/orders/ViewOrder";
import UserLayout from "./userDashBoard/UserLayout";
import UserHome from "./userDashBoard/UserHome";
import OrderTracking from "./userDashBoard/OrderTracking";
import UserOrdersDisplay from "./userDashBoard/UserOrdersDisplay";
import OrderDetail from "./userDashBoard/OrderDetail";
import UserReview from "./userDashBoard/UserReview";
import Review from "./adminPages/Review";
import OrderSuccess from "./productPages/OrderSuccess";
import OrderCanceled from "./productPages/OrderCancelled";
import Admin from "./adminPages/Admin";
import Customers from "./adminPages/Customers";
import ProtectedRoute from "./ProtectedRoute";
import DeliveryCost from "./adminPages/DeliveryCost";
import Profile from "./adminPages/Profile";
import Reports from "./adminPages/Reports";

const App = () => {
  const location = useLocation();
  const [search, setSearch] = useState();

  const isHiddenRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="font-poppins min-h-screen">
      {!isHiddenRoute && <Navbar/>}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/pickup" element={<PickUp />} />
        <Route path="/offerProduct" element={<OfferProduct />} />
        <Route
          path="/productListMainPage"
          element={<ProductListMainPage search={search} setSearch={setSearch} />}
        />
        <Route path="/productDetail/:id" element={<ProductDetail />} />
        <Route path="/favaurite" element={<Favaurite />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-canceled" element={<OrderCanceled />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="addProduct" element={<AddProductCatagorie />} />
            <Route path="addProductType" element={<AddProductType />} />
            <Route path="productType" element={<ProductType />} />
            <Route path="displayProducts" element={<DisplayProducts />} />
            <Route path="displayProduct" element={<AdminProductDetail />} />
            <Route path="productUpdate" element={<ProductUpdate />} />
            <Route path="catagory" element={<Catagory />} />
            <Route path="updateCatagory" element={<CatagoryUpdate />} />
            <Route path="displayProductType" element={<DisplayProductType />} />
            <Route path="updateProductType" element={<UpdateProductType />} />
            <Route path="displayOrders" element={<DisplayOrders />} />
            <Route path="viewOrder/:orderId" element={<ViewOrder />} />
            <Route path="reviewAdmin" element={<Review />} />
            <Route path="displayAdmin" element={<Admin />} />
            <Route path="customers" element={<Customers />} />
            <Route path="deliverycost" element={<DeliveryCost />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reports" element={<Reports />} />

          </Route>
        </Route>

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="orderTrack/:orderId" element={<OrderTracking />} />
            <Route path="userOrderDisplay" element={<UserOrdersDisplay />} />
            <Route path="orderdetail/:orderId" element={<OrderDetail />} />
            <Route path="review" element={<UserReview />} />
          </Route>
        </Route>
      </Routes>

      {!isHiddenRoute && <Footer />}
    </div>
  );
};

export default App;
