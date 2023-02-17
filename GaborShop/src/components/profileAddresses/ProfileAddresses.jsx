import "./profileAddresses.css";
import { useSelector } from "react-redux";
import NewAddress from "./NewAddress";
import SetDefaultAddress from "./SetDefaultAddress";
import DeleteAddress from "./DeleteAddress";

export default function ProfileAddress() {
  const addresses = useSelector((state) => state.user.userAddresses);

  return (
    <section className="addresses-section">
      <h2>Addresses</h2>
      <NewAddress />
      {addresses.map((address) => {
        return (
          <div key={address.id} className="address-container">
            <p>Country: {address.country}</p>
            {address?.state && <p>State: {address.state}</p>}
            {address?.city && <p>City: {address.city}</p>}
            <p>Address: {address.address}</p>
            {address.default ? (
              <p className="default-address">Default</p>
            ) : (
              <div className="address-buttons">
                <SetDefaultAddress id={address.id} />
                <DeleteAddress id={address.id} />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
