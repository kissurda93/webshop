import "./shoppingCart.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import indexed_db from "../../indexedDB/indexedDB";
import { remove, get, put } from "../../indexedDB/indexedDB";
import {
  removeProduct,
  changeTotalQuantity,
  changeProductQuantity,
  changeTotalPrice,
} from "./cartProductsSlice";
import Spinner from "../../components/spinners/Spinner";

export default function ShoppingCart() {
  const { productsInCart, totalPrice, status } = useSelector(
    (state) => state.cartProducts
  );
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const navTo = useNavigate();

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

    if (newProduct.quantity > pRedux.stock || newProduct.quantity <= 0) {
      return;
    }

    const putRequest = await put(newProduct, db);
    if (putRequest === "Product added") {
      dispatch(
        changeProductQuantity({ id: productInDb.product_id, method: method })
      );
      dispatch(changeTotalQuantity(method === "increment" && "increment"));
      dispatch(changeTotalPrice({ method, price: parseInt(pRedux.price) }));
    }
  }

  const toProductPage = (id) => navTo(`/product/${id}`);

  return (
    <>
      {status === "loading" ? (
        <Spinner />
      ) : (
        <section className="cart-container">
          <h2>My Cart</h2>
          <ul className="cart-products-container">
            {productsInCart.length !== 0 ? (
              productsInCart.map((product) => {
                return (
                  <li className="cart-product-container" key={product.id}>
                    <img
                      src={product.thumbnail}
                      alt="Product image"
                      onClick={() => toProductPage(product.id)}
                    />
                    <div className="cart-product-text">
                      <p>{product.title}</p>
                      <p>${product.price}</p>
                    </div>
                    <div className="cart-product-options">
                      <p>
                        Quantity: {product.quantity}
                        <button
                          onClick={() =>
                            changeQuantity("decrement", product.id)
                          }
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            changeQuantity("increment", product.id)
                          }
                        >
                          +
                        </button>
                      </p>
                      <p>
                        SubTotal: $
                        {(product.quantity * product.price).toFixed(2)}
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

          {productsInCart.length !== 0 && (
            <div className="total-price-container">
              <p>Total Price: ${totalPrice}</p>
              <button>Buy</button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
