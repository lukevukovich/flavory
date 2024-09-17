import "./Home.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate } from "react-router-dom";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {
  const navigate = useNavigate();

  // State for random saying
  const [saying, setSaying] = useState("");

  // Set random saying on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sayings.length);
    setSaying(sayings[randomIndex]);
  }, []);

  return (
    <div>
      <Header></Header>
      <div className="home-search-panel">
        <text className="home-search-prompt">{saying}</text>
        <SearchBar></SearchBar>
        <button
          className="discover-home header-button"
          onClick={() => {
            navigate("/discover");
          }}
        ><FontAwesomeIcon icon={faCompass} className="discover-icon utensils-icon" />
          discover
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
