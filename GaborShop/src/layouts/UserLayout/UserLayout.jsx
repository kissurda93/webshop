import { Outlet } from "react-router-dom";
import "./header.css";
import Message from "../../components/Message/Message";
import { resetMessage } from "../../components/Message/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserLayout() {
  const { message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const navTo = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 5000);
  }, [message]);

  const handleLogOut = (event) => {
    const headers = {
      headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
    };
    axios
      .get(`${import.meta.env.VITE_API_URL}/logout`, headers)
      .then((result) => {
        Cookies.remove("user_token");
        navTo("/signin");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <header>
        <nav className="header-nav">
          <ul>
            <li>
              <NavLink to={"/"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/products"}>Products</NavLink>
            </li>
          </ul>
        </nav>
        <section className="account-section">
          {Cookies.get("user_token") ? (
            <>
              <NavLink to={"/profile"}>Profile</NavLink>
              <NavLink onClick={handleLogOut}>SignOut</NavLink>
            </>
          ) : (
            <>
              <NavLink to={"/signin"}>SignIn</NavLink>
              <NavLink to={"/demoaccount"}>DemoAccount</NavLink>
            </>
          )}
        </section>
      </header>
      <main>
        <Message message={message} type={type} />
        <Outlet />
      </main>
    </>
  );
}