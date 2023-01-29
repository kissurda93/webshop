import axios from "axios";
import { useState, useEffect } from "react";
import ShowInputError from "../../components/Message/ShowInputError";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function NewPasswordRequest() {
  const [data, setData] = useState({});
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();
  const navTo = useNavigate();
  let { token } = useParams();

  useEffect(() => {
    if (Cookies.get("user_token")) return navTo("/profile");
  }, []);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputError({ errors: {} });
    axios
      .post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        ...data,
        token,
      })
      .then((result) => {
        dispatch(setMessage(result.data.message));
        navTo("/signin");
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setInputError(error.response.data);
        } else {
          dispatch(setMessage(error.response.data.message));
          dispatch(setType(error.response.data.type));
        }
      });
  };

  return (
    <div className="user-form-layout-container">
      <section className="user-form-section">
        <h2>Set Your New Password</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
            />
            <ShowInputError status={inputError} inputName="email" />
          </label>
          <label>
            Password
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
            />
            <ShowInputError status={inputError} inputName="password" />
          </label>
          <label>
            Password Confirmation
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              onChange={handleChange}
            />
          </label>
          <button type="submit">Set Password</button>
        </form>
      </section>
    </div>
  );
}
