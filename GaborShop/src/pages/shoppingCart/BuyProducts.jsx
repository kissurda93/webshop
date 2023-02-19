import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function BuyProducts() {
  const [loading, setLoading] = useState(false);
  const { productsInCart } = useSelector((state) => state.cartProducts);
  const { id } = useSelector((state) => state.user.userInfo);

  const products = productsInCart.map((product) => {
    return { product_id: product.id, product_quantity: product.quantity };
  });

  const sendPaymentRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/simplePay-request`,
        { id, products },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );
      window.location = response.data.url;
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={sendPaymentRequest} disabled={loading}>
      {loading ? "..." : "Buy"}
    </button>
  );
}
