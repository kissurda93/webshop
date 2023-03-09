import "./paginater.css";
import { useSelector, useDispatch } from "react-redux";
import parse from "html-react-parser";
import { setCurrentPage } from "../../pages/Products/productsSlice";

export default function Paginater() {
  const { pages, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  return (
    <section className="paginater-container">
      {status !== "loading"
        ? pages.map((page) => {
            return (
              <button
                key={page.label}
                onClick={() => dispatch(setCurrentPage(page.url))}
                className={page.active ? "page-active" : ""}
              >
                {parse(page.label)}
              </button>
            );
          })
        : ""}
    </section>
  );
}
