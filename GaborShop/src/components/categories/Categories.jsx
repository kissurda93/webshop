import axios from "axios";
import "./categories.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "../../pages/Products/productsSlice";
import { useSelector } from "react-redux";

export default function Categories() {
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

  return (
    <ul className="categories">
      {categories.map((category) => {
        return (
          <li key={category.id} className="category">
            {category.name.toUpperCase()}
          </li>
        );
      })}
    </ul>
  );
}
