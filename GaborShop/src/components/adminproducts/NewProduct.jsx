import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { newAdminProduct } from "../../layouts/AdminLayout/adminDataSlice";
import { useDispatch } from "react-redux";
import { setMessage } from "../Message/messageSlice";

export default function NewProduct() {
  const [showForm, setShowForm] = useState(false);
  const [submitData, setSubmitData] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const closeForm = () => {
    setSubmitData({});
    setImages([]);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setSubmitData({ ...submitData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      for (const key in submitData) {
        formData.append(`${key}`, `${submitData[key]}`);
      }

      for (let i = 0; i < images.length; i++) {
        formData.append(`image${i}`, images[i], `${images[i].name}`);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/>>>new-product<<<`,
        formData,
        {
          headers: {
            adminToken: Cookies.get("admin_token"),
          },
        }
      );

      if (response.status === 201) {
        dispatch(newAdminProduct(response.data));
        dispatch(setMessage("Product created successfully!"));
        setShowForm(false);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowForm(true)} className="new-product-btn">
        <FontAwesomeIcon icon={faPlus} />
        Add New Product
      </button>
      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <form
            onClick={(e) => e.stopPropagation()}
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <label>
              Title
              <input
                type="text"
                name="title"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Brand
              <input
                type="text"
                name="brand"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Category
              <input
                type="text"
                name="category"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                step="0.01"
                name="price"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                name="stock"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                onChange={handleChange}
                rows="4"
                required
              />
            </label>
            <label>
              Images
              <input
                type="file"
                name="images"
                multiple
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                required
              />
            </label>
            <button disabled={loading} type="submit">
              {loading ? "..." : "Upload"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
