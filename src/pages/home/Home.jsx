import "./Home.css"
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect } from "react";
import { sayings } from "../../utils/Sayings";

export default function Home() {

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
      </div>
      <Footer></Footer>
    </div>
  );
}
