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
import { fetchCartProducts } from "./pages/shoppingCart/fetchCartProducts";
import { useDispatch } from "react-redux";
import { fetchUser } from "./layouts/UserLayout/fetchUser";
import Cookies from "js-cookie";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartProducts());
    if (Cookies.get("user_token")) dispatch(fetchUser());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="signin" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="profile" element={<Profile />} />
        <Route path="shopping-cart" element={<ShoppingCart />} />
        <Route path="/reset-password/:token" element={<NewPasswordRequest />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/activated" element={<ActivatedAccount />} />
    </Routes>
  );
}
