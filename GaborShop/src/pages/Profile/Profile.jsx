import "./profile.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../layouts/UserLayout/userSlice";
import { setMessage, setType } from "../../components/Message/messageSlice";
import ShowInputError from "../../components/Message/ShowInputError";
import Spinner from "../../components/spinners/Spinner";
import DeleteAccountBtn from "../../components/deleteAccountBtn/DeleteAccountBtn";
import NewPassword from "../../components/newPassword/NewPassword";

export default function Profile() {
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const { id, name, email } = useSelector((state) => state.user.userInfo);
  const [inputError, setInputError] = useState({ errors: {} });
  const [data, setData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("user_token") == undefined) return navTo("/signin");
    axios
      .get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
      })
      .then((result) => {
        const { id, name, email } = result.data;
        const userInfo = { id, name, email };
        dispatch(setUser(userInfo));
      })
      .catch((error) => {
        Cookies.remove("user_token");
        navTo("/signin");
      });
  }, []);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/user_update`,
        { ...data, id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setInputError(error.response.data);
        } else {
          dispatch(setMessage(error.response.data.message));
          dispatch(setType(error.response.data.type));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {id ? (
        <section className="profile-section">
          <h2>Hi {name}</h2>
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={name}
                  onChange={handleChange}
                />
                <ShowInputError status={inputError} inputName="name" />
              </label>
            </div>
            <div className="input-group">
              <label>
                Email
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder={email}
                  onChange={handleChange}
                />
                <ShowInputError status={inputError} inputName="email" />
              </label>
            </div>
            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? "..." : "Save"}
              </button>
            </div>
          </form>
          <div>
            <DeleteAccountBtn id={id} />
            <button
              className="update-password"
              onClick={() => setOpenModal(true)}
            >
              Change Password
            </button>
            {openModal && (
              <NewPassword
                closeModal={() => {
                  setOpenModal(false);
                }}
                id={id}
              />
            )}
          </div>
        </section>
      ) : (
        <Spinner />
      )}
    </>
  );
}
