import { useState } from "react";
import "./newPassword.css";
import axios from "axios";
import Cookies from "js-cookie";
import { setMessage, setType } from "../Message/messageSlice";
import { useDispatch } from "react-redux";
import ShowInputError from "../Message/ShowInputError";

export default function NewPassword({ closeModal, id }) {
  const [data, setData] = useState({});
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/password_update`,
        { ...data, id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      )
      .then((response) => {
        closeModal();
        dispatch(setMessage(response.data.message));
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setInputError(error.response.data);
        } else {
          closeModal();
          dispatch(setMessage(error.response.data.message));
          dispatch(setType(error.response.data.type));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="overlay" onClick={closeModal}>
      <section
        className="profile-section"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Old Password
              <input
                type="password"
                name="old_password"
                id="old_password"
                onChange={handleChange}
              />
              <ShowInputError status={inputError} inputName="old_password" />
            </label>
          </div>
          <div className="input-group">
            <label>
              New Password
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
              <ShowInputError status={inputError} inputName="password" />
            </label>
          </div>
          <div className="input-group">
            <label>
              Password Confirmation
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
