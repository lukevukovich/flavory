import "./LoadingScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLemon } from "@fortawesome/free-solid-svg-icons";
import { useRef, useEffect } from "react";

export default function LoadingScreen({ loadingScreenBool }) {
  const loadingScreenRef = useRef(null);

  // Display loading page if needed
  useEffect(() => {
    if (loadingScreenBool) {
      loadingScreenRef.current.style.display = "flex";
    } else {
      loadingScreenRef.current.style.display = "none";
    }
  }, [loadingScreenBool]);

  return (
    <div className="loading-screen" ref={loadingScreenRef}>
      <FontAwesomeIcon
        icon={faLemon}
        className="button-icon spinner loading-screen-spinner"
      ></FontAwesomeIcon>
    </div>
  );
}
