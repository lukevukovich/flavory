import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faBars, faCaretDown } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <div className="header">
      <div className="left">
        <button className="header-button">
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
