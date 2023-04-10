import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMessage, setType } from "../Message/messageSlice";
import { resetUser } from "../../layouts/UserLayout/userSlice";
import Cookies from "js-cookie";

export default function DeleteAccountBtn() {
  const navTo = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm("Are You Sure You Want To Delete Your Account?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/user_delete`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
          }
        );

        if (response.status === 200) {
          Cookies.remove("user_token");
          dispatch(resetUser());
          navTo("/signup");
          dispatch(setMessage("Account Deleted!"));
        }
      } catch (e) {
        dispatch(setMessage(e.response.data.message));
        dispatch(setType(e.response.data.type));
      }
    }
  };

  return <button onClick={handleDelete}>Delete Account</button>;
}
