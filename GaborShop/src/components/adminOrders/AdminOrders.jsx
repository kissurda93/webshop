import "./adminOrders.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import AdminSingleOrder from "./AdminSingleOrder";

export default function AdminOrders() {
  const { orders } = useSelector((state) => state.adminData);
  const [orderRef, setOrderRef] = useState("");
  const [order, setOrder] = useState({});
  const [showOrder, setShowOrder] = useState(false);

  const handleChange = (e) => {
    setOrderRef(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const foundedOrder = orders.find((order) => order.order_ref == orderRef);
    if (foundedOrder) {
      setOrder(foundedOrder);
      setShowOrder(true);
    }
  };

  const handleClickOnOrder = (e) => {
    const foundedOrder = orders.find(
      (order) => order.id == e.target.dataset.id
    );
    setOrder(foundedOrder);
    setShowOrder(true);
  };

  return (
    <section className="admin-orders-section">
      <section className="filters">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="relative-container">
            <input
              type="text"
              placeholder="Enter the order reference number"
              name="search"
              onChange={handleChange}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
      </section>
      {orders.length !== 0 && (
        <div className="admin-orders-list">
          {orders.map((order) => {
            return (
              <div
                className="admin-order-inlist"
                key={order.id}
                data-id={order.id}
                onClick={handleClickOnOrder}
              >
                {order.user_data.name} {order.order_ref}{" "}
                {order.delivery_status != "Completed" ? (
                  <FontAwesomeIcon icon={faCircleExclamation} color="red" />
                ) : (
                  <FontAwesomeIcon icon={faCircleCheck} color="green" />
                )}
              </div>
            );
          })}
        </div>
      )}
      {showOrder && (
        <AdminSingleOrder order={order} setShowOrder={setShowOrder} />
      )}
    </section>
  );
}
