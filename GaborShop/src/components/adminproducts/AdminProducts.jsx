import "./adminProducts.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import AdminSingleProduct from "./AdminSingleProduct";
import NewProduct from "./NewProduct";

export default function AdminProducts() {
  const { products } = useSelector((state) => state.adminData);
  const [showProduct, setShowProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});
  const [singleProductImages, setSingleProductImages] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const closeProduct = () => {
    setSingleProduct({});
    setSingleProductImages([]);
    setShowProduct(false);
  };

  const handleClickPropagationOnProduct = (e) => {
    if (e.target.dataset.key !== undefined) {
      return products.find((product) => product.id == e.target.dataset.key);
    } else {
      const parentElement = e.target.parentElement;
      return products.find(
        (product) => product.id == parentElement.dataset.key
      );
    }
  };

  const openProduct = (e) => {
    const product = handleClickPropagationOnProduct(e);
    setSingleProduct(product);
    setSingleProductImages(product.images);
    setShowProduct(true);
  };

  const handleSearchChange = (e) => {
    setSearchData(() =>
      products.filter(
        (product) =>
          product.title.toLowerCase().slice(0, e.target.value.length) ===
          e.target.value.toLowerCase()
      )
    );
  };

  return (
    <>
      <NewProduct />
      <section className="filters">
        <form className="search-form">
          <div className="relative-container">
            <input
              type="text"
              placeholder="Search for Product..."
              name="search"
              onChange={handleSearchChange}
            />
          </div>
        </form>
      </section>
      <section className="admin-products-container">
        {searchData.length !== 0
          ? searchData.map((product) => {
              return (
                <div
                  key={product.id}
                  data-key={product.id}
                  className="admin-product-container"
                  onClick={openProduct}
                >
                  <img src={product.thumbnail} alt="Product image" />
                  <p>{product.title}</p>
                  <p>{product.description}</p>
                </div>
              );
            })
          : products.map((product) => {
              return (
                <div
                  key={product.id}
                  data-key={product.id}
                  className="admin-product-container"
                  onClick={openProduct}
                >
                  <img src={product.thumbnail} alt="Product image" />
                  <p>{product.title}</p>
                  <p>{product.description}</p>
                </div>
              );
            })}
      </section>
      {showProduct && (
        <AdminSingleProduct
          singleProduct={singleProduct}
          singleProductImages={singleProductImages}
          closeProduct={closeProduct}
        />
      )}
    </>
  );
}
