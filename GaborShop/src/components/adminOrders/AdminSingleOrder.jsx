import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateOrderDeliveryStatus } from "../../layouts/AdminLayout/adminDataSlice";
import { setMessage } from "../Message/messageSlice";
import Cookies from "js-cookie";

export default function AdminSingleOrder({ order, setShowOrder }) {
  const [checked, setChecked] = useState(
    order.delivery_status === "Completed" ? true : false
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async () => {
    setLoading(true);
    try {
      if (order.delivery_status !== "Completed" && checked) {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/>>>update-order<<</${order.id}`,
          {},
          {
            headers: {
              adminToken: Cookies.get("admin_token"),
            },
          }
        );
        if (response.status === 200) {
          dispatch(setMessage(response.data));
          dispatch(updateOrderDeliveryStatus(order.id));
          setShowOrder(false);
        }
      } else {
        return;
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={() => setShowOrder(false)}>
      <div
        className="admin-order-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-order-user-data">
          <h3>User data</h3>
          <p>ID: {order.user_data.id}</p>
          <p>Name: {order.user_data.name}</p>
          <p>Email: {order.user_data.email}</p>
        </div>
        <div className="admin-order-products">
          <h3>Products</h3>
          {order.products_data.map((product) => {
            return (
              <div className="admin-order-product" key={product.id}>
                <p>{product.title}</p>
                <p>Price: ${product.price}</p>
                <p>Discount: {product.discountPercentage}%</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            );
          })}
        </div>
        <div>
          <p>Total Price: ${order.total_price}</p>
        </div>
        <div className="admin-order-addresses">
          <div>
            <h3>Invoice Address</h3>
            <p>Country: {order.invoice_address.country}</p>
            <p>State: {order.invoice_address.state}</p>
            <p>City: {order.invoice_address.city}</p>
            <p>Address: {order.invoice_address.address}</p>
          </div>
          <div>
            <h3>Delivery Address</h3>
            <p>Country: {order.delivery_address.country}</p>
            <p>State: {order.delivery_address.state}</p>
            <p>City: {order.delivery_address.city}</p>
            <p>Address: {order.delivery_address.address}</p>
          </div>
        </div>
        <div className="admin-order-statuses">
          <p>Payment Status: {order.payment_status}</p>
          <label>
            Delivery Status: {checked ? "Completed" : order.delivery_status}
            <input type="checkbox" onChange={() => setChecked(!checked)} />
          </label>
          <p>Order Reference Number: {order.order_ref}</p>
          <p>
            IPN Status: {order.ipn_status ? "IPN Received" : "IPN Not Received"}
          </p>
          <p>IPN Response: {order.ipn_response}</p>
        </div>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "..." : "Save"}
        </button>
      </div>
    </div>
  );
}
