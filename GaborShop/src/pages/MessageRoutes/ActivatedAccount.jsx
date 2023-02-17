import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ActivatedAccount() {
  const dispatch = useDispatch();
  const navTo = useNavigate();

  useEffect(() => {
    if (Cookies.get("user_token")) Cookies.remove("user_token");

    dispatch(setMessage("You Have Confirmed Your Account!"));
    navTo("/signin");
  }, []);

  return <></>;
}
