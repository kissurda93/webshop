import "./productPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/spinners/Spinner";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import Price from "../../components/price/Price";
import Rating from "../../components/rating/Rating";
import indexed_db from "../../indexedDB/indexedDB";
import { get, put } from "../../indexedDB/indexedDB";
import { useDispatch } from "react-redux";
import { fetchCartProducts } from "../shoppingCart/fetchCartProducts";

export default function ProductPage() {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/product/${id}`)
      .then((result) => {
        setProduct(result.data.product);
        setImages(result.data.images);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const addToCart = async (id, quantity) => {
    try {
      const db = await indexed_db();
      const product = await get(id, db);
      if (!product) {
        await put({ product_id: id, quantity }, db);
      } else {
        await put(
          { product_id: id, quantity: quantity + product.quantity },
          db
        );
      }
    } catch (error) {
      console.warn(error);
    } finally {
      dispatch(fetchCartProducts());
      setDisabled(false);
    }
  };

  const handleToCartSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);
    addToCart(product.id, quantity);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="single-product-container">
          <ImageSlider images={images} />
          <div className="product-description">
            <p>
              <span className="product-info-label">Name:</span>
              {product.title}
            </p>
            <p>
              <span className="product-info-label">Description:</span>
              {product.description}
            </p>
            <p>
              <span className="product-info-label">Brand:</span>
              {product.brand}
            </p>
            <p>
              <span className="product-info-label">Stock:</span>
              {product.stock}
            </p>
            <div className="price-rating-flex">
              <Price
                price={product.price}
                discountPercentage={product.discountPercentage}
              />
              <Rating rating={product.rating} />
            </div>
          </div>
          <form onSubmit={handleToCartSubmit} className="add-to-cart-form">
            <label>
              Quantity:
              <input
                placeholder="1"
                min={1}
                max={product.stock}
                type="number"
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={disabled}>
              Add to Cart
            </button>
          </form>
        </section>
      )}
    </>
  );
}
