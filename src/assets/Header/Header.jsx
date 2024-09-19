import "./Header.css";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBars,
  faCaretDown,
  faUser,
  faBookmark,
  faCompass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signOut, checkSignInStatus } from "../../utils/Auth";

export default function Header({ setRecipeList }) {
  const navigate = useNavigate();

  // State for menu panel
  const [expanded, setExpanded] = useState(false);

  // Refs for menu panel and sign in button
  const menuPanel = useRef(null);
  const menuButton = useRef(null);
  const menuEmail = useRef(null);
  const menuEmailBox = useRef(null);

  // State for sign in button text
  const [signInText, setSignInText] = useState("sign in");

  // Check if user is signed in and set email
  async function setEmailOnSignIn() {
    const { isSignedIn, user } = await checkSignInStatus();
    if (isSignedIn) {
      const username = user.email.split("@")[0];
      menuEmail.current.innerHTML = username;
      menuEmail.current.style.display = "flex";
      menuEmailBox.current.style.display = "flex";
      setSignInText(`sign out`);
      menuPanel.current.style.height = "175px";
    } else {
      menuEmail.current.style.display = "none";
      menuEmailBox.current.style.display = "none";
      setSignInText("sign in");
      menuPanel.current.classList.remove("signed-in");
      menuPanel.current.style.height = "130px";
    }
  }

  // Check if user is signed in on load
  useEffect(() => {
    setEmailOnSignIn();
  }, []);

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
          className="button"
          onClick={() => {
            if (setRecipeList) {
              setRecipeList([]);
            }
            const clearButton = document.querySelector(
              ".search-bar-clear-button"
            );
            const inputBar = document.querySelector(".search-bar-input");
            if (clearButton) {
              clearButton.click();
              inputBar.placeholder = "search for recipes";
            }
            navigate("/");
          }}
        >
          <FontAwesomeIcon icon={faUtensils} className="button-icon" />
          flavory
        </button>
      </div>
      <div className="right">
        <button
          className="button"
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
          <div className="menu-email" ref={menuEmailBox}>
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="menu-email-icon"
            ></FontAwesomeIcon>
            <span className="menu-email-text" ref={menuEmail}></span>
          </div>
          <button
            className="menu-button"
            onClick={async () => {
              const { isSignedIn, user } = await checkSignInStatus();
              if (isSignedIn) {
                const success = await signOut();
                if (success) {
                  setEmailOnSignIn();
                }
              } else {
                const success = await signIn();
                if (success) {
                  setEmailOnSignIn();
                }
              }
            }}
          >
            <div className="menu-sign-in">
              <FontAwesomeIcon
                icon={faUser}
                className="menu-button-icon menu-button-icon-user"
              ></FontAwesomeIcon>
              <span className="menu-sign-in-text">{signInText}</span>
            </div>
          </button>
          <button
            className="menu-button"
            onClick={() => {
              navigate("/discover");
            }}
          >
            <FontAwesomeIcon
              icon={faCompass}
              className="menu-button-icon menu-button-icon-discover"
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
