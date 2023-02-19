import "./profileOrders.css";
import { useSelector } from "react-redux";

export default function ProfileOrders() {
  const orders = useSelector((state) => state.user.userOrders);
  return (
    <>
      <section className="user-orders-section">
        <h2>Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => {
            const { country, state, city, address } = order.address;
            return (
              <div className="user-order-container" key={order.id}>
                <p>Payment Status: {order.payment_status}</p>
                <p>Delivery Status: {order.delivery_status}</p>
                <p>Order Reference Number: {order.order_ref}</p>
                <p>Address: {`${city} ${address}`}</p>
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
