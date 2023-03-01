export default function AdminSingleUser({ user, setShowUser }) {
  return (
    <div className="overlay" onClick={() => setShowUser(false)}>
      <div className="admin-single-user" onClick={(e) => e.stopPropagation()}>
        <div>
          <h3>Account</h3>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>
            Account status:{" "}
            {user.email_verified_at ? "Verified" : "Not verified"}
          </p>
          <p>Account created at: {user.created_at}</p>
          <p>Account updated at: {user.updated_at}</p>
        </div>
        <div className="admin-single-user-addresses">
          <h3>Addresses</h3>
          {user.addresses.map((address) => {
            return (
              <div key={address.id}>
                <p>Country: {address.country}</p>
                <p>State: {address?.state}</p>
                <p>City: {address?.city}</p>
                <p>Address: {address.address}</p>
                {address.default && <p>Default</p>}
              </div>
            );
          })}
        </div>
        <div>
          <h3>Orders</h3>
          {user.orders.length !== 0 &&
            user.orders.map((order) => {
              return <p key={order.id}>{order.order_ref}</p>;
            })}
        </div>
      </div>
    </div>
  );
}
