import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setMessage, setType } from "../../components/Message/messageSlice";
import axios from "axios";
import Cookies from "js-cookie";
import SimplePayLogo from "../../assets/logo/simplepay.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/spinners/Spinner";
import { clear } from "../../indexedDB/indexedDB";
import indexed_db from "../../indexedDB/indexedDB";
import { clearCart } from "./cartProductsSlice";

export default function BuyProducts() {
  const navTo = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { productsInCart } = useSelector((state) => state.cartProducts);
  const { userAddresses, userDefaultAddress } = useSelector(
    (state) => state.user
  );
  const { id } = useSelector((state) => state.user.userInfo);
  const [showModal, setShowModal] = useState(false);
  const invoice = useRef(userDefaultAddress.id);
  const delivery = useRef(userDefaultAddress.id);

  const products = productsInCart.map((product) => {
    return { product_id: product.id, product_quantity: product.quantity };
  });

  const openPaymentForm = (e) => {
    if (!Cookies.get("user_token")) {
      dispatch(
        setMessage(
          "You need to sign in to your account to start a transaction!"
        )
      );
      navTo("/signin");
    } else {
      setShowModal(true);
    }
  };

  const sendPaymentRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/simplePay-request/${id}`,
        {
          products,
          invoice: invoice.current.value,
          delivery: delivery.current.value,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );

      if (response.status === 200) {
        const db = await indexed_db();
        await clear(db);
        dispatch(clearCart());
        dispatch(setMessage(response.data));
      }
    } catch (error) {
      console.warn(error);
      if (error.response.status === 422) {
        dispatch(setType("failed"));
        dispatch(setMessage(response.data));
      }
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button onClick={openPaymentForm}>Pay</button>
      {showModal && (
        <div
          className="overlay"
          onClick={() => {
            if (!loading) setShowModal(false);
          }}
        >
          <form
            onSubmit={sendPaymentRequest}
            className="payment-form"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="payment-instructions">
              <p>
                <FontAwesomeIcon icon={faCircleExclamation} color="orange" /> By
                clicking on the logo, you will arrive at the SimplePay payment
                interface. This is a Sandbox interface where you cannot enter a
                real bank card or account number. However, you can choose
                between successful and unsuccessful card numbers in the
                drop-down menu. By default, a successful card number will be
                selected.
              </p>
              <p>
                <FontAwesomeIcon icon={faCircleExclamation} color="orange" />{" "}
                Furthermore, the Sandbox account is only available to me for HUF
                currency, so the prices are converted from USD to HUF!
              </p>
            </div>
            <label>
              Invoice Address:
              <select
                name="invoice"
                defaultValue={userDefaultAddress.id}
                ref={invoice}
              >
                {userAddresses.map((address) => {
                  return (
                    <option key={address.id} value={address.id}>
                      {address.city
                        ? `${address.city} - ${address.address}`
                        : `${address.country} - ${address.address}`}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              Delivery Address:
              <select
                name="delivery"
                defaultValue={userDefaultAddress.id}
                ref={delivery}
              >
                {userAddresses.map((address) => {
                  return (
                    <option key={address.id} value={address.id}>
                      {address.city
                        ? `${address.city} - ${address.address}`
                        : `${address.country} - ${address.address}`}
                    </option>
                  );
                })}
              </select>
            </label>
            {loading ? (
              <Spinner white={true} />
            ) : (
              <input type="image" disabled={loading} src={SimplePayLogo} />
            )}
          </form>
        </div>
      )}
    </>
  );
}
