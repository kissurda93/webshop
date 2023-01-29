import "./products.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "./productsAsync";
import Spinner from "../../components/spinners/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { PRODUCTS_URL } from "./productsAsync";
import Paginater from "../../components/paginater/Paginater";
import Categories from "../../components/categories/Categories";

export default function Products() {
  const { status, productsList } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [link, setLink] = useState(PRODUCTS_URL);

  useEffect(() => {
    dispatch(fetchProducts(link));
  }, [link]);

  return (
    <>
      <section className="filters">
        <form className="search-form">
          <div className="relative-container">
            <input type="text" placeholder="Search Product..." name="search" />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
        <Categories />
      </section>
      <section className="products">
        {status === "loading" ? (
          <Spinner />
        ) : productsList ? (
          productsList.map((product) => {
            return (
              <div className="product-container" key={product.id}>
                <div className="img-container">
                  <img
                    src={product.thumbnail}
                    alt="Image of the product"
                    loading="lazy"
                    width={450}
                    height={450}
                  />
                </div>
                <div className="product-info-container">
                  <p>{product.title}</p>
                  <p>$ {product.price}</p>
                  <p>
                    <FontAwesomeIcon icon={faStar} color="gold" />{" "}
                    {product.rating}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          ""
        )}
      </section>
      <Paginater setLink={setLink} />
    </>
  );
}
