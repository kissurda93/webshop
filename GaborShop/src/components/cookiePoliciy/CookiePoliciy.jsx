import "./cookiePolicy.css";
import Cookies from "js-cookie";

export default function CookiePolicy({ setShowPolicy }) {
  const acceptPolicy = () => {
    setShowPolicy(false);
    Cookies.set("gaborshop_cookies_accepted", true);
  };

  return (
    <section className="cookie-policy">
      <p>
        Please be aware that our website uses cookies to improve user experience
        and stores your personal data. By using our website, you consent to the
        use of cookies and storage of your personal data.
      </p>
      <button onClick={acceptPolicy}>Accept</button>
    </section>
  );
}
