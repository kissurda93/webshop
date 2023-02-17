import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDefaultAddress } from "../../layouts/UserLayout/userSlice";

export default function SetDefaultAddress({ id }) {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.userInfo.id);
  const [loading, setLoading] = useState(false);

  const setToDefault = async () => {
    setLoading(true);
    try {
      const patchRequest = await axios.patch(
        `${import.meta.env.VITE_API_URL}/setDefaultAddress`,
        { user_id, id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );
      dispatch(setDefaultAddress(id));
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={setToDefault} disabled={loading}>
      {loading ? "..." : "Set as Default"}
    </button>
  );
}
