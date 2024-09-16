import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBars,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="left">
        <button
          className="header-button"
          onClick={() => {
            navigate("/");
          }}
        >
          <FontAwesomeIcon icon={faUtensils} className="utensils-icon" />
          flavory
        </button>
      </div>
      <div className="right">
        <button className="header-button">
          <FontAwesomeIcon icon={faBars} className="menu-icon" />
          <FontAwesomeIcon icon={faCaretDown} className="caret-down-icon" />
        </button>
      </div>
    </div>
  );
}
