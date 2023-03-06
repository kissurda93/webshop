import "./user_form.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShowInputError from "../../components/Message/ShowInputError";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setMessage, setType } from "../../components/Message/messageSlice";
import { fetchUser } from "../../layouts/UserLayout/fetchUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ForgottenPassword from "../../components/forgottenPassword/ForgottenPassword";

export default function Login() {
  const [data, setData] = useState({});
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("user_token")) return navTo("/profile");
  }, []);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );
      console.log(response);
      Cookies.set("user_token", response.data);
      dispatch(fetchUser());
      navTo("/profile");
    } catch (error) {
      if (error.response.data.errors) {
        setInputError(error.response.data);
      } else {
        dispatch(setMessage(error.response.data.message));
        dispatch(setType(error.response.data.type));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-layout-container">
      <section className="user-form-section">
        <h2>Please Sign In</h2>
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
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Sign In"}
          </button>
        </form>
        <p>
          Or <Link to={"/signup"}>create a new account</Link> if you don't have
          one!
        </p>
        <p>
          Did you forget your password?{" "}
          <Link onClick={() => setOpenModal(true)}>Click Here!</Link>
        </p>
      </section>
      {openModal && (
        <ForgottenPassword closeModal={() => setOpenModal(false)} />
      )}
    </div>
  );
}
