import "./adminLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AdminLayout() {
  const navTo = useNavigate();

  const checkUser = () => {
    if (!Cookies.get("admin_token")) navTo("/profile");
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove("admin_token");
    navTo("/admin-login");
  };

  return (
    <>
      <aside className="admin-aside">
        <nav className="admin-nav">
          <ul>
            <li>Products</li>
            <li>Orders</li>
            <li>Users</li>
          </ul>
        </nav>
        <nav>
          <a onClick={handleLogout}>Sign Out</a>
        </nav>
      </aside>
      <main></main>
    </>
  );
}
