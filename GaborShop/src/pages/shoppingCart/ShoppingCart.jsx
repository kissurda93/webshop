import "./shoppingCart.css";
import { useSelector, useDispatch } from "react-redux";
import { changeProductQuantity } from "./cartProductsSlice";
import { useState } from "react";
import indexed_db from "../../indexedDB/indexedDB";
import { remove, get, put } from "../../indexedDB/indexedDB";
import { removeProduct } from "./cartProductsSlice";

export default function ShoppingCart() {
  const productsInCart = useSelector(
    (state) => state.cartProducts.productsInCart
  );
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  async function deleteProduct(id) {
    setDisabled(true);
    const db = await indexed_db();
    const removeRequest = await remove(id, db);
    if (removeRequest == "Product deleted") {
      dispatch(removeProduct(id));
    }
    setDisabled(false);
  }

  async function changeQuantity(method, id) {
    const db = await indexed_db();
    const productInDb = await get(id, db);
    const pRedux = productsInCart.find((product) => product.id == id);

    const newProduct =
      method == "increment"
        ? { ...productInDb, quantity: productInDb.quantity + 1 }
        : { ...productInDb, quantity: productInDb.quantity - 1 };

    if (newProduct.quantity > pRedux.stock) {
      newProduct.quantity = pRedux.stock;
    }

    console.log(newProduct);

    if (newProduct.quantity <= 0) {
      const removeRequest = await remove(id, db);
      if (removeRequest == "Product deleted") {
        dispatch(removeProduct(id));
        return;
      }
    }

    const putRequest = await put(newProduct, db);
    if (putRequest === "Product added")
      dispatch(
        changeProductQuantity({ id: productInDb.product_id, method: method })
      );
  }

  return (
    <section className="cart-container">
      <h2>My Cart</h2>
      <ul className="cart-products-container">
        {productsInCart.length !== 0 ? (
          productsInCart.map((product) => {
            return (
              <li className="cart-product-container" key={product.id}>
                <img src={product.thumbnail} alt="Product image" />
                <div className="cart-product-text">
                  <p>{product.title}</p>
                  <p>${product.price}</p>
                </div>
                <div className="cart-product-options">
                  <p>
                    Quantity: {product.quantity}
                    <button
                      onClick={() => changeQuantity("decrement", product.id)}
                    >
                      -
                    </button>
                    <button
                      onClick={() => changeQuantity("increment", product.id)}
                    >
                      +
                    </button>
                  </p>
                  <p>
                    SubTotal: $
                    {Number.parseFloat(
                      product.quantity * product.price
                    ).toFixed(2)}
                  </p>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    disabled={disabled}
                  >
                    Remove Product
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <li className="empty-container">
            <p>Cart is Empty</p>
          </li>
        )}
      </ul>
    </section>
  );
}
