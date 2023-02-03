import "./rating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

export default function Rating({ rating }) {
  const [rated, setRated] = useState(false);

  return (
    <div className="rating-container" onClick={() => setRated(true)}>
      {rated ? (
        <FontAwesomeIcon icon={faStar} color="gold" />
      ) : (
        <FontAwesomeIcon icon={farStar} color="gold" />
      )}

      <p>{rating}</p>
    </div>
  );
}
