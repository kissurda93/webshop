import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setName, setEmail } from "../../layouts/UserLayout/userSlice";
import axios from "axios";
import Cookies from "js-cookie";
import ShowInputError from "../Message/ShowInputError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { setMessage, setType } from "../Message/messageSlice";

export default function ProfileAddress() {
  const dispatch = useDispatch();
  const { name, email, email_verified_at } = useSelector(
    (state) => state.user.userInfo
  );
  const [inputError, setInputError] = useState({ errors: {} });
  const [data, setData] = useState({ name: name, email: email });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });
    if (data.name === name && data.email === email) return setLoading(false);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user_update`,
        { ...data },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );

      console.log(response);

      if (response.status === 200) {
        if (data.name !== name) dispatch(setName(data.name));
        if (data.email !== email) dispatch(setEmail(data.email));

        dispatch(setMessage(response.data));
      }
    } catch (e) {
      if (e.response.data.errors) {
        setInputError(e.response.data);
      } else {
        dispatch(setMessage(e.response.data.message));
        dispatch(setType(e.response.data.type));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Personal infos</h2>

        <div className="input-group">
          <label>
            Name
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={name}
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
              defaultValue={email}
              onChange={handleChange}
            />
            <ShowInputError status={inputError} inputName="email" />
          </label>
        </div>

        <div className="button-group">
          {!(data.name === name && data.email === email) && (
            <button type="submit" disabled={loading}>
              {loading ? "..." : "Save"}
            </button>
          )}
        </div>
      </form>
      {email_verified_at === null && (
        <p className="info">
          <FontAwesomeIcon icon={faExclamationCircle} color="red" />
          Your account has not been verified yet
        </p>
      )}
    </>
  );
}
