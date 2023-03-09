import "./spinner.css";

export default function Spinner({ white }) {
  return (
    <div className="spinner-container">
      <div className="lds-ring">
        <div className={white ? "white-spinner" : ""}></div>
        <div className={white ? "white-spinner" : ""}></div>
        <div className={white ? "white-spinner" : ""}></div>
        <div className={white ? "white-spinner" : ""}></div>
      </div>
    </div>
  );
}
