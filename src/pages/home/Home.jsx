import "./Home.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate } from "react-router-dom";
import { faCompass, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipePane from "../../assets/RecipePane/RecipePane";

export default function Home() {
  const navigate = useNavigate();

  const recipePane = useRef(null);
  const discoverButton = useRef(null);

  // State for random saying
  const [saying, setSaying] = useState("");

  const [recipeList, setRecipeList] = useState([]);

  // Set random saying on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sayings.length);
    setSaying(sayings[randomIndex]);
  }, []);

  useEffect(() => {
    if (recipeList.length === 0) {
      recipePane.current.style.display = "none";
      discoverButton.current.style.display = "flex";
    } else {
      recipePane.current.style.display = "flex";
      discoverButton.current.style.display = "none";
    }
  }, [recipeList]);

  return (
    <div>
      <Header></Header>
      <div className="home-search-panel">
        <text className="home-search-prompt">{saying}</text>
        <SearchBar setRecipeList={setRecipeList}></SearchBar>
        <div className="home-recipe-panel" ref={recipePane}>
          <text className="home-recipe-results"><FontAwesomeIcon icon={faSearch} className="home-recipe-results-icon"></FontAwesomeIcon>search results</text>
          <RecipePane recipeList={recipeList}></RecipePane>
        </div>
        <button
          className="discover-home header-button"
          ref={discoverButton}
          onClick={() => {
            navigate("/discover");
          }}
        >
          <FontAwesomeIcon
            icon={faCompass}
            className="discover-icon utensils-icon"
          />
          discover
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
