import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeAddress } from "../../layouts/UserLayout/userSlice";
import { setMessage } from "../Message/messageSlice";

export default function DeleteAddress({ id }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const deleteAddress = async () => {
    setLoading(true);
    try {
      const deleteRequest = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-address/${id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );
      if (deleteRequest.status === 200) {
        dispatch(removeAddress(id));
        setMessage(response.data);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={() => deleteAddress()} disabled={loading}>
      {loading ? "..." : "Delete Address"}
    </button>
  );
}
