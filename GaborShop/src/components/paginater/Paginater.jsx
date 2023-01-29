import "./paginater.css";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

export default function Paginater({ setLink }) {
  const { pages, status } = useSelector((state) => state.products);

  return (
    <section className="paginater-container">
      {status !== "loading"
        ? pages.map((page) => {
            return (
              <button
                key={page.label}
                onClick={() => setLink(page.url)}
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
