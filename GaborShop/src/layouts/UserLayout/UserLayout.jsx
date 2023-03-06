import "./header.css";
import { useEffect } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { resetUser } from "./userSlice";
import { fetchCartProducts } from "../../pages/shoppingCart/fetchCartProducts";
import { fetchUser } from "./fetchUser";
import { ReactComponent as Logo } from "../../assets/logo/jglogo.svg";

export default function UserLayout() {
  const cartQuantity = useSelector((state) => state.cartProducts.quantity);
  const dispatch = useDispatch();
  const navTo = useNavigate();

  useEffect(() => {
    dispatch(fetchCartProducts());
    if (Cookies.get("user_token")) dispatch(fetchUser());
  }, []);

  const handleLogOut = () => {
    const headers = {
      headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
    };
    axios
      .get(`${import.meta.env.VITE_API_URL}/logout`, headers)
      .then(() => {
        Cookies.remove("user_token");
        dispatch(resetUser());
        navTo("/signin");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <header>
        <Logo className="logo" />
        <nav className="header-nav">
          <ul>
            <li>
              <NavLink to={"/"}>About</NavLink>
            </li>
            <li>
              <NavLink to={"/products"}>Products</NavLink>
            </li>

            {Cookies.get("user_token") ? (
              <>
                <li>
                  <NavLink to={"/profile"}>Profile</NavLink>
                </li>
                <li>
                  <Link onClick={handleLogOut}>SignOut</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to={"/signup"}>SignUp</NavLink>
                </li>
                <li>
                  <NavLink to={"/signin"}>SignIn</NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink to={"/shopping-cart"} className="cart-container">
                <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                <span className="cart-quantity">{cartQuantity}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main
        className={
          window.location.href == `${import.meta.env.VITE_FRONT_URL}/` ||
          window.location.href == `${import.meta.env.VITE_FRONT_URL}/profile`
            ? "less-margin-main"
            : "more-margin-main"
        }
      >
        <Outlet />
      </main>
    </>
  );
}
