import "./adminLayout.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchAdminData } from "./fetchAdminData";
import Spinner from "../../components/spinners/Spinner";
import { resetAdminData } from "./adminDataSlice";
import AdminProducts from "../../components/adminproducts/AdminProducts";
import AdminOrders from "../../components/adminOrders/AdminOrders";
import AdminUsers from "../../components/adminUsers/AdminUsers";

const showComponentsAllFalse = {
  products: false,
  orders: false,
  users: false,
};

export default function AdminLayout() {
  const navTo = useNavigate();
  const dispatch = useDispatch();
  const [showComponent, setShowComponent] = useState({
    products: true,
    orders: false,
    users: false,
  });
  const { status } = useSelector((state) => state.adminData);

  useEffect(() => {
    if (!Cookies.get("admin_token")) navTo("/admin-login");
    if (Cookies.get("admin_token")) dispatch(fetchAdminData());
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.remove("admin_token");
    dispatch(resetAdminData());
    navTo("/admin-login");
  };

  const handleComponentChange = (e) => {
    e.preventDefault();
    setShowComponent({
      ...showComponentsAllFalse,
      [e.target.getAttribute("data-link")]: true,
    });
  };

  return (
    <>
      {status === "loading" ? (
        <Spinner />
      ) : (
        <>
          <aside className="admin-aside">
            <nav className="admin-nav">
              <ul>
                <li>
                  <a
                    href="/"
                    data-link="products"
                    onClick={handleComponentChange}
                    className={showComponent.products ? "active-admin-nav" : ""}
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    data-link="orders"
                    onClick={handleComponentChange}
                    className={showComponent.orders ? "active-admin-nav" : ""}
                  >
                    Orders
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    data-link="users"
                    onClick={handleComponentChange}
                    className={showComponent.users ? "active-admin-nav" : ""}
                  >
                    Users
                  </a>
                </li>
              </ul>
            </nav>
            <nav>
              <a href="/" onClick={handleLogout}>
                Sign Out
              </a>
            </nav>
          </aside>
          <main className="left-margin-main">
            {showComponent.products && <AdminProducts />}
            {showComponent.orders && <AdminOrders />}
            {showComponent.users && <AdminUsers />}
          </main>
        </>
      )}
    </>
  );
}
