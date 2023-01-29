import axios from "axios";
import { useState, useEffect } from "react";
import ShowInputError from "../../components/Message/ShowInputError";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
import { setUser } from "../../layouts/UserLayout/userSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [data, setData] = useState({});
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("user_token")) return navTo("/profile");
  }, []);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });

    axios
      .post(`${import.meta.env.VITE_API_URL}/register`, { ...data })
      .then((result) => {
        Cookies.set("user_token", result.data.token);
        const { id, name, email } = result.data.user;
        const userInfo = { id, name, email };

        dispatch(setUser(userInfo));
        dispatch(setMessage(result.data.message));
        navTo("/profile");
      })
      .catch((error) => {
        setInputError(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="user-form-layout-container">
      <section className="user-form-section">
        <h2>Please Sign Up</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input id="name" name="name" type="text" onChange={handleChange} />
            <ShowInputError status={inputError} inputName="name" />
          </label>
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
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Sign Up"}
          </button>
        </form>
        <p>
          Or <Link to={"/signin"}> Sign In </Link> if you have an account!
        </p>
      </section>
    </div>
  );
}
