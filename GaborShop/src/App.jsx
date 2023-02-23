import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import UserLayout from "./layouts/UserLayout/UserLayout";
import NotFound from "./pages/NotFound/NotFound";
import Products from "./pages/Products/Products";
import ProductPage from "./pages/productPage/ProductPage";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import ActivatedAccount from "./pages/MessageRoutes/ActivatedAccount";
import NewPasswordRequest from "./pages/newPasswordRequest/NewPasswordRequest";
import LandingPage from "./pages/landingpage/LandingPage";
import ShoppingCart from "./pages/shoppingCart/ShoppingCart";
import PaymentMessage from "./pages/MessageRoutes/PaymentMessage";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminLogin from "./pages/adminLogin/AdminLogin";
import { resetMessage } from "./components/Message/messageSlice";
import Message from "./components/Message/Message";

export default function App() {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.message);

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 5000);
  }, [message]);

  return (
    <>
      <Message message={message} type={type} />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="signin" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shopping-cart" element={<ShoppingCart />} />
          <Route
            path="/reset-password/:token"
            element={<NewPasswordRequest />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/activated" element={<ActivatedAccount />} />
        <Route path="/payment-message" element={<PaymentMessage />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </>
  );
}
