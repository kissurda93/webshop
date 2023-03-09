import "./products.css";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "./productsAsync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/spinners/Spinner";
import Paginater from "../../components/paginater/Paginater";
import Categories from "../../components/categories/Categories";
import Price from "../../components/price/Price";
import { setCurrentPage } from "./productsSlice";

export default function Products() {
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const { status, productsList } = useSelector((state) => state.products);
  const currentPage = useSelector((state) => state.products.currentPage);
  const [searchData, setSearchData] = useState({});
  const [searchCounter, setSearchCounter] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ currentPage, searchData }));
  }, [currentPage, searchCounter]);

  const toProductPage = (id) => navTo(`/product/${id}`);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    dispatch(setCurrentPage(`${import.meta.env.VITE_API_URL}/search-products`));
    setSearchCounter(searchCounter + 1);
  };

  return (
    <>
      <section className="filters">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="relative-container">
            <input
              type="text"
              placeholder="Search for Product..."
              name="search"
              onChange={(event) =>
                setSearchData({
                  [event.target.name]: event.target.value,
                })
              }
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                "..."
              ) : (
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              )}
            </button>
          </div>
        </form>
        <Categories />
      </section>
      <section className="products">
        {status === "loading" ? (
          <Spinner />
        ) : (
          productsList &&
          productsList.map((product) => {
            return (
              <div
                className="product-container"
                key={product.id}
                onClick={() => toProductPage(product.id)}
              >
                <div className="img-container">
                  <img
                    src={product.thumbnail}
                    alt="Image of the product"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="product-info-container">
                  <p>{product.title}</p>
                  <div className="price-rating-flex">
                    <Price
                      price={product.price}
                      discountPercentage={product.discountPercentage}
                      inList={true}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
      <Paginater />
    </>
  );
}
