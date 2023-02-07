import "./productPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/spinners/Spinner";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import Price from "../../components/price/Price";
import Rating from "../../components/rating/Rating";
import indexed_db from "../../indexedDB/indexedDB";

export default function ProductPage() {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dbPut = indexed_db("put");
  const dbGet = indexed_db("get");

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

  const handleToCartSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);
    const productInCart = await dbGet(product.id);
    if (productInCart !== undefined) {
      dbPut({
        product_id: product.id,
        quantity: quantity + productInCart.quantity,
      });
      setButtonLoading(false);
    } else {
      dbPut({ product_id: product.id, quantity });
      setButtonLoading(false);
    }
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
                min={1}
                max={product.stock}
                type="number"
                onChange={handleChange}
              />
            </label>
            <button type="submit">
              {buttonLoading ? "..." : "Add to Cart"}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
