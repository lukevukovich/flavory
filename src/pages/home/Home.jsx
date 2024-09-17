import "./Home.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [saying, setSaying] = useState("");

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
        >
          discover
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
