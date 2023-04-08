import "./adminLogin.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMessage, setType } from "../../components/Message/messageSlice";
import Cookies from "js-cookie";
import axios from "axios";
import ShowInputError from "../../components/Message/ShowInputError";

export default function AdminLogin() {
  const navTo = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState({ errors: {} });

  useEffect(() => {
    if (Cookies.get("admin_token")) {
      return navTo("/admin");
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/>>>login-admin<<<`,
        data
      );
      Cookies.set("admin_token", response.data);
      navTo("/admin");
    } catch (error) {
      if (error.response.data.errors) {
        setInputError(error.response.data);
      } else {
        dispatch(setType("failed"));
        dispatch(setMessage(error.response.data));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Hello Admin</h2>
        <label>
          Email
          <input type="email" name="email" onChange={handleChange} />
          <ShowInputError status={inputError} inputName={"email"} />
        </label>
        <label>
          Password
          <input type="password" name="password" onChange={handleChange} />
          <ShowInputError status={inputError} inputName={"password"} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
