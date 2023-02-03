import "./productPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/spinners/Spinner";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import Price from "../../components/price/Price";
import Rating from "../../components/rating/Rating";

export default function ProductPage() {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleToCartSubmit = (event) => {
    event.preventDefault();
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
                name="quantity"
                min={1}
                max={product.stock}
                type="number"
              />
            </label>
            <button type="submit">Add to Cart</button>
          </form>
        </section>
      )}
    </>
  );
}