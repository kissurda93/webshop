import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
import { useNavigate } from "react-router-dom";

export default function ActivatedAccount() {
  const dispatch = useDispatch();
  const navTo = useNavigate();

  useEffect(() => {
    dispatch(setMessage("You Have Confirmed Your Email Address!"));
    navTo("/signin");
  }, []);

  return <></>;
}
