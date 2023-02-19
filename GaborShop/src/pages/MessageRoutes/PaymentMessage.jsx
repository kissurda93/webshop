import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
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
          dispatch(setMessage("Payment was successfully!"));
          navTo("/shopping-cart");
        }
        break;

      case "TIMEOUT":
        dispatch(setMessage("Payment failed due to timeout!"));
        navTo("/shopping-cart");
        break;

      case "FAIL":
        dispatch(setMessage("Payment failed!"));
        navTo("/shopping-cart");
        break;

      case "CANCEL":
        dispatch(setMessage("Payment process was cancelled!"));
        navTo("/shopping-cart");
        break;

      default:
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
