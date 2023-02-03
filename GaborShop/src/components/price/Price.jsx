import "./price.css";

export default function Price({ price, discountPercentage, inList }) {
  const newPrice = price - price * (discountPercentage / 100);

  return (
    <div className={inList ? "price-container-column" : "price-container"}>
      <p className={discountPercentage !== "0.00" ? "old-price" : "price"}>
        ${price}
      </p>
      {discountPercentage !== "0.00" && (
        <p className="new-price">${Number.parseFloat(newPrice).toFixed(2)}</p>
      )}
    </div>
  );
}
