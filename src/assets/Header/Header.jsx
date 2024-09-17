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
import { signIn, signOut, checkSignInStatus, getUser } from "../../utils/Auth";

export default function Header() {
  const navigate = useNavigate();

  // State for menu panel
  const [expanded, setExpanded] = useState(false);
  const menuPanel = useRef(null);
  const menuButton = useRef(null);
  const menuEmail = useRef(null);

  const [userButtonText, setUserButtonText] = useState("sign in");

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

  // Check if user is signed in
  useEffect(() => {
    setEmailOnSignIn();
  }, []);

  async function setEmailOnSignIn() {
    const { isSignedIn, user } = await checkSignInStatus();
    if (isSignedIn) {
      menuEmail.current.innerHTML = user.email;
      menuEmail.current.style.display = "flex";
      setUserButtonText("sign out");
    } else {
      menuEmail.current.style.display = "none";
      setUserButtonText("sign in");
    }
  }

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
          <button className="menu-email menu-button" ref={menuEmail}></button>
          <button
            className="menu-button menu-button-showcase"
            onClick={async () => {
              const { isSignedIn, user } = await checkSignInStatus();
              if (isSignedIn) {
                await signOut();
                setEmailOnSignIn();
                signInButton.current.innerHTML = "sign in";
              } else {
                await signIn();
                setEmailOnSignIn();
                signInButton.current.innerHTML = "sign out";
              }
            }}
          >
            <FontAwesomeIcon
              icon={faUser}
              className="menu-button-icon"
            ></FontAwesomeIcon>
            {userButtonText}
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
