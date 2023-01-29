import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMessage, setType } from "../Message/messageSlice";
import { resetUser } from "../../layouts/UserLayout/userSlice";
import Cookies from "js-cookie";
import "./deleteAccountbtn.css";

export default function DeleteAccountBtn({ id }) {
  const navTo = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm("Are You Sure You Want To Delete Your Account")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/user_delete/${id}`, {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        })
        .then((response) => {
          dispatch(resetUser());
          navTo("/signup");
          dispatch(setMessage("Account Deleted!"));
        })
        .catch((error) => {
          dispatch(setMessage(error.response.data.message));
          dispatch(setType(error.response.data.type));
        });
    }
  };

  return (
    <button className="delete" onClick={handleDelete}>
      Delete Account
    </button>
  );
}
