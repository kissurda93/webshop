import "./imageSlider.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ImageSlider({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const length = images ? images.length : 0;

  const nextImage = () => {
    setCurrentImage(currentImage == length - 1 ? 0 : currentImage + 1);
  };

  const previousImage = () => {
    setCurrentImage(currentImage == 0 ? length - 1 : currentImage - 1);
  };

  return (
    <div className="img-slider">
      <FontAwesomeIcon
        icon={faArrowAltCircleLeft}
        className="left-arrow"
        onClick={() => previousImage()}
      />
      <FontAwesomeIcon
        icon={faArrowAltCircleRight}
        className="right-arrow"
        onClick={() => nextImage()}
      />
      {images &&
        images.map((image, index) => {
          return (
            <div
              className={index == currentImage ? "slide-active" : "slide"}
              key={index}
            >
              {index == currentImage && (
                <img
                  src={image.url}
                  key={image.id}
                  alt="Product image"
                  className="image-in-slide"
                />
              )}
            </div>
          );
        })}
    </div>
  );
}
