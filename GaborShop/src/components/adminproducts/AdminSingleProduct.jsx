import ImageSlider from "../imageSlider/ImageSlider";
import Price from "../price/Price";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import {
  updateAdminProductData,
  deleteAdminProduct,
} from "../../layouts/AdminLayout/adminDataSlice";
import { setMessage } from "../Message/messageSlice";

export default function AdminSingleProduct({
  singleProduct,
  singleProductImages,
  closeProduct,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (Object.keys(data).length === 0) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/>>>update-product<<</${
          singleProduct.id
        }`,
        data,
        {
          headers: {
            adminToken: Cookies.get("admin_token"),
          },
        }
      );
      if (response.status === 200) {
        dispatch(updateAdminProductData({ id: singleProduct.id, ...data }));
        dispatch(setMessage(response.data));
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/>>>delete-product<<</${
            singleProduct.id
          }`,
          {
            headers: {
              adminToken: Cookies.get("admin_token"),
            },
          }
        );
        if (response.status === 200) {
          dispatch(deleteAdminProduct(singleProduct.id));
          dispatch(setMessage(response.data));
          closeProduct();
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="overlay" onClick={closeProduct}>
      <section
        className="admin-single-product"
        onClick={(e) => e.stopPropagation()}
      >
        <ImageSlider images={singleProductImages} />
        <form className="admin-product-description" onSubmit={handleSubmit}>
          <label>
            ID:
            <p>{singleProduct.id}</p>
          </label>
          <label>
            Name:
            <p>{singleProduct.title}</p>
          </label>
          <label>
            Stock:
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={singleProduct.stock}
              onChange={handleChange}
            />
          </label>
          <label>
            DiscountPercentage:
            <input
              name="discount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={
                singleProduct.discountPercentage
                  ? singleProduct.discountPercentage
                  : "0.00"
              }
              onChange={handleChange}
            />
          </label>

          <Price
            price={singleProduct.price}
            discountPercentage={
              data.discount ? data.discount : singleProduct.discountPercentage
            }
          />
          {Object.keys(data).length !== 0 && (
            <button type="submit" disabled={loading}>
              {loading ? "..." : "Save"}
            </button>
          )}
          <button disabled={loading} onClick={handleDelete}>
            Delete Product
          </button>
        </form>
      </section>
    </div>
  );
}
