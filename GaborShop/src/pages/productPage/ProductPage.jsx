import "./productPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/spinners/Spinner";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Price from "../../components/price/Price";

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
            <Price
              price={product.price}
              discountPercentage={product.discountPercentage}
            />
            <p>
              <FontAwesomeIcon icon={faStar} color={"gold"} />
              {product.rating}
            </p>
            <p>{product.stock}</p>
          </div>
          <div className="button-container">
            <button>Add to Cart</button>
          </div>
        </section>
      )}
    </>
  );
}
