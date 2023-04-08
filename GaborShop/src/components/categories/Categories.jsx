import axios from "axios";
import "./categories.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "../../pages/Products/productsSlice";
import { useSelector } from "react-redux";
import { setCurrentPage } from "../../pages/Products/productsSlice";
import Spinner from "../spinners/Spinner";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`
      );
      if (response.status === 200) {
        dispatch(setCategories(response.data));
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = (id) => {
    dispatch(setCurrentPage(`${import.meta.env.VITE_API_URL}/products/${id}`));
  };

  return (
    <ul className="categories">
      {loading ? (
        <Spinner />
      ) : (
        categories.map((category) => {
          return (
            <li
              key={category.id}
              className="category"
              onClick={() => getCategory(category.id)}
            >
              {category.name.toUpperCase()}
            </li>
          );
        })
      )}
    </ul>
  );
}
