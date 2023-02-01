import axios from "axios";
import "./categories.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "../../pages/Products/productsSlice";
import { useSelector } from "react-redux";

export default function Categories({ setLink }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => {
        dispatch(setCategories(response.data.categories));
      })
      .catch((error) => console.log(error));
  }, []);

  const requestCategory = (id) => {
    setLink(`${import.meta.env.VITE_API_URL}/products/${id}`);
  };

  return (
    <ul className="categories">
      {categories.map((category) => {
        return (
          <li
            key={category.id}
            className="category"
            onClick={() => requestCategory(category.id)}
          >
            {category.name.toUpperCase()}
          </li>
        );
      })}
    </ul>
  );
}
