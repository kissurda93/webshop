import { Route, Routes } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import NotFound from "./pages/NotFound/NotFound";
import Products from "./pages/Products/Products";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import ActivatedAccount from "./pages/MessageRoutes/ActivatedAccount";
import NewPasswordRequest from "./pages/newPasswordRequest/NewPasswordRequest";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route path="products" element={<Products />} />
        <Route path="signin" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/reset-password/:token" element={<NewPasswordRequest />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/activated" element={<ActivatedAccount />} />
    </Routes>
  );
}
