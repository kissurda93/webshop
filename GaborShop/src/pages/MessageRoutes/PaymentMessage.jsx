import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage, setType } from "../../components/Message/messageSlice";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import indexed_db from "../../indexedDB/indexedDB";
import { clear } from "../../indexedDB/indexedDB";

export default function PaymentMessage() {
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const [searchParams] = useSearchParams();

  const checkURLparams = async () => {
    const params = searchParams.get("r");
    const response = JSON.parse(window.atob(params));

    switch (response.e) {
      case "SUCCESS":
        const db = await indexed_db();
        const clearRequest = await clear(db);
        if (clearRequest === "Store is clear") {
          dispatch(setMessage("Payment in progress!"));
          navTo("/shopping-cart");
        }
        break;

      case "TIMEOUT":
        dispatch(setType("failed"));
        dispatch(setMessage("Payment failed due to timeout!"));
        navTo("/shopping-cart");
        break;

      case "FAIL":
        dispatch(setType("failed"));
        dispatch(setMessage("Payment failed!"));
        navTo("/shopping-cart");
        break;

      case "CANCEL":
        dispatch(setType("failed"));
        dispatch(setMessage("Payment process was cancelled!"));
        navTo("/shopping-cart");
        break;

      default:
        dispatch(setType("failed"));
        dispatch(setMessage("Payment failed!"));
        navTo("/shopping-cart");
        break;
    }
  };

  useEffect(() => {
    checkURLparams();
  }, []);

  return <></>;
}
