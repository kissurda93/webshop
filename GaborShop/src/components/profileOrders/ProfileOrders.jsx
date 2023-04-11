import "./profileOrders.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileOrders() {
  const orders = useSelector((state) => state.user.userOrders);
  return (
    <>
      <section className="user-orders-section">
        <h2>Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => {
            return (
              <div className="user-order-container" key={order.id}>
                <p>
                  Payment Status: {order.payment_status}{" "}
                  <FontAwesomeIcon
                    icon={
                      order.payment_status === "Successfull"
                        ? faCircleCheck
                        : faCircleExclamation
                    }
                    color={
                      order.payment_status === "Successfull" ? "green" : "red"
                    }
                  />
                </p>
                <p>
                  Delivery Status: {order.delivery_status}{" "}
                  <FontAwesomeIcon
                    icon={
                      order.delivery_status === "Completed"
                        ? faCircleCheck
                        : faCircleExclamation
                    }
                    color={
                      order.delivery_status === "Completed" ? "green" : "red"
                    }
                  />
                </p>
                <p>Order Reference Number: {order.order_ref}</p>
                <p>
                  Invoice Address:{" "}
                  {`${order.invoice_address.city} ${order.invoice_address.address}`}
                </p>
                <p>
                  Delivery Address:{" "}
                  {`${order.delivery_address.city} ${order.delivery_address.address}`}
                </p>
                <p>Total Price: ${order.total_price}</p>
                {order.products_data.map((product) => {
                  return (
                    <div className="user-order-product" key={product.id}>
                      <p>{product.title}</p>
                      <p>${product.price}</p>
                      <p>x{product.quantity}</p>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="empty-user-orders">
            <p>You have no orders yet</p>
          </div>
        )}
      </section>
    </>
  );
}
