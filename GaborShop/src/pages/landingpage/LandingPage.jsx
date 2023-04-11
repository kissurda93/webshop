import "./landingPage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faTag } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

export default function LandingPage() {
  return (
    <div className="gradient-container">
      <h1>
        Gábor Shop
        <div className="tag-icon">
          <FontAwesomeIcon icon={faTag} />
        </div>
      </h1>
      <section className="text-container">
        <p>
          <span className="exclamation-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </span>
          This is a demo e-commerce website!
        </p>
        <p>
          <span className="exclamation-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </span>
          You may see both real and fictitious products.
        </p>
        <p>
          <span className="exclamation-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </span>
          The owner and developer of the site does not sell products, so the
          simulated purchases on the site are not real, and they do not burden
          the "buyer" with payment obligations!
        </p>
        <p>
          <span className="exclamation-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </span>
          This demo was created for learning purposes.
        </p>
      </section>
      <section className="landing-button-container">
        {!Cookies.get("user_token") && (
          <>
            <button>
              <Link to={"/signin"}>Sign In</Link>
            </button>
            <button>
              <Link to={"/signup"}>Sign Up</Link>
            </button>
          </>
        )}
        <button>
          <Link to={"/products"}>Check Products</Link>
        </button>
      </section>
    </div>
  );
}
