import "./profile.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Spinner from "../../components/spinners/Spinner";
import DeleteAccountBtn from "../../components/deleteAccountBtn/DeleteAccountBtn";
import NewPassword from "../../components/newPassword/NewPassword";
import ProfileAddresses from "../../components/profileAddresses/ProfileAddresses";
import ProfilePersonal from "../../components/profilePersonal/ProfilePersonal";
import ProfileOrders from "../../components/profileOrders/ProfileOrders";

const emptyUserInfoObject = {
  personal: false,
  addresses: false,
  orders: false,
};

export default function Profile() {
  const { id } = useSelector((state) => state.user.userInfo);
  const [showUserInfos, setShowUserInfos] = useState({
    personal: true,
    addresses: false,
    orders: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const navTo = useNavigate();

  useEffect(() => {
    if (Cookies.get("user_token") == undefined) return navTo("/signin");
  }, []);

  const handleShowUserInfo = (event) => {
    setShowUserInfos({
      ...emptyUserInfoObject,
      [event.target.getAttribute("data-info")]: true,
    });
  };

  return (
    <>
      {id ? (
        <section className="profile-section">
          <aside>
            <nav>
              <ul>
                <li data-info="personal" onClick={handleShowUserInfo}>
                  My Personal Infos
                </li>
                <li data-info="addresses" onClick={handleShowUserInfo}>
                  My Addresses
                </li>
                <li data-info="orders" onClick={handleShowUserInfo}>
                  My Orders
                </li>
              </ul>
            </nav>
            <div>
              <button
                className="update-password"
                onClick={() => setOpenModal(true)}
              >
                Change Password
              </button>
              <DeleteAccountBtn id={id} />
              {openModal && (
                <NewPassword
                  closeModal={() => {
                    setOpenModal(false);
                  }}
                  id={id}
                />
              )}
            </div>
          </aside>
          <section className="user-data-in-profile">
            {showUserInfos.personal && <ProfilePersonal />}
            {showUserInfos.addresses && <ProfileAddresses />}
            {showUserInfos.orders && <ProfileOrders />}
          </section>
        </section>
      ) : (
        <Spinner />
      )}
    </>
  );
}
