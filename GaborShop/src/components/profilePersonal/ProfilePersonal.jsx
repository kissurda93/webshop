import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setName, setEmail } from "../../layouts/UserLayout/userSlice";
import axios from "axios";
import Cookies from "js-cookie";
import ShowInputError from "../Message/ShowInputError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function ProfileAddress() {
  const dispatch = useDispatch();
  const [inputError, setInputError] = useState({ errors: {} });
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { name, id, email, email_verified_at } = useSelector(
    (state) => state.user.userInfo
  );

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });

    const dataToSubmit = { ...data };
    if (dataToSubmit?.name === "") delete dataToSubmit.name;
    if (dataToSubmit?.email === "") delete dataToSubmit.email;

    axios
      .patch(
        `${import.meta.env.VITE_API_URL}/user_update`,
        { ...dataToSubmit, id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      )
      .then(() => {
        if (dataToSubmit.name) dispatch(setName(dataToSubmit.name));
        if (dataToSubmit.email) dispatch(setEmail(dataToSubmit.email));
        setData({});
        event.target.reset();
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
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Personal infos</h2>

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
      {email_verified_at === null && (
        <p className="info">
          <FontAwesomeIcon icon={faExclamationCircle} color="red" />
          Your account has not been verified yet
        </p>
      )}
    </>
  );
}
