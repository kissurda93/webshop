import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../components/Message/messageSlice";
import axios from "axios";
import Cookies from "js-cookie";

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
        `${import.meta.env.VITE_API_URL}/simplePay-request`,
        {
          id,
          products,
          invoice: invoice.current.value,
          delivery: delivery.current.value,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );
      window.location = response.data.url;
    } catch (error) {
      console.warn(error);
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
            <button type="submit" disabled={loading}>
              {loading ? "..." : "SimplePay"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
