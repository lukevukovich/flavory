import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBars,
  faCaretDown,
  faUser,
  faBookmark,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // State for menu panel
  const [expanded, setExpanded] = useState(false);
  const menuPanel = useRef(null);
  const menuButton = useRef(null);

  // Detect click outside of menu panel
  const handleClickOutside = (event) => {
    if (
      menuPanel.current &&
      !menuPanel.current.contains(event.target) &&
      expanded
    ) {
      if (!menuButton.current.contains(event.target)) {
        setExpanded(!expanded);
      }
    }
  };

  // Handle click outside of menu panel
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

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
        <button
          className="header-button"
          ref={menuButton}
          onClick={() => {
            if (expanded) {
              setExpanded(false);
            } else {
              setExpanded(true);
            }
          }}
        >
          <FontAwesomeIcon icon={faBars} className="menu-icon" />
          <FontAwesomeIcon
            icon={faCaretDown}
            className={`caret-down-icon  ${expanded ? "rotate" : ""}`}
          />
        </button>
        <div
          className={`menu-panel  ${expanded ? "visible" : "hidden"}`}
          ref={menuPanel}
        >
          <button className="menu-button menu-button-showcase">
            <FontAwesomeIcon
              icon={faUser}
              className="menu-button-icon"
            ></FontAwesomeIcon>
            sign in
          </button>
          <button
            className="menu-button"
            onClick={() => {
              navigate("/discover");
            }}
          >
            <FontAwesomeIcon
              icon={faCompass}
              className="menu-button-icon"
            ></FontAwesomeIcon>
            discover
          </button>
          <button
            className="menu-button"
            onClick={() => {
              navigate("/saved");
            }}
          >
            <FontAwesomeIcon
              icon={faBookmark}
              className="menu-button-icon menu-button-icon-bookmark"
            ></FontAwesomeIcon>
            saved
          </button>
        </div>
      </div>
    </div>
  );
}
