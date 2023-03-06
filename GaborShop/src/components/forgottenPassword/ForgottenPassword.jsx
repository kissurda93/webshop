import { useState } from "react";
import axios from "axios";
import { setMessage, setType } from "../Message/messageSlice";
import { useDispatch } from "react-redux";
import ShowInputError from "../Message/ShowInputError";

export default function ForgottenPassword({ closeModal }) {
  const [data, setData] = useState({});
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${import.meta.env.VITE_API_URL}/user_new_password`, { ...data })
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
      });
  };

  return (
    <div className="overlay" onClick={closeModal}>
      <div
        className="user-form-layout-container"
        onClick={(event) => event.stopPropagation()}
      >
        <section className="user-form-section">
          <h2>Type your email address </h2>
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
            <button className="send-password-link" type="submit">
              Send Link To Email Address
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
