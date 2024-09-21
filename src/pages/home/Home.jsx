import "./Home.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate, useSearchParams } from "react-router-dom";
import { faCompass, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeResults from "../../assets/RecipeResults/RecipeResults";
import { getRecipes } from "../../utils/RecipeAPI";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs
  const recipePane = useRef(null);
  const discoverButton = useRef(null);
  const searchCountText = useRef(null);

  // State for random saying
  const [saying, setSaying] = useState("");

  // States for recipe list and searching
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreIcon, setLoadMoreIcon] = useState(faPlus);

  // Set random saying on load
  useEffect(() => {
    const search = searchParams.get("search");
    if (search === null) {
      navigate("/");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    const randomIndex = Math.floor(Math.random() * sayings.length);
    setSaying(sayings[randomIndex]);
  }, []);

  // Set states for recipe list
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
      <Header setRecipeList={setRecipeList}></Header>
      <div className="home-search-panel">
        <span className="heading-text home-search-prompt">{saying}</span>
        <SearchBar
          getRecipes={getRecipes}
          setRecipeList={setRecipeList}
          setMoreResultsLink={setMoreResultsLink}
          searchCount={searchCount}
          setSearchCount={setSearchCount}
          searchCountText={searchCountText}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        ></SearchBar>
        <div className="home-recipe-panel" ref={recipePane}>
          <div className="home-recipe-results-panel">
            <span className="home-recipe-results">
              <FontAwesomeIcon
                icon={faSearch}
                className="home-recipe-results-icon"
              ></FontAwesomeIcon>
              search results
            </span>
            <span className="home-recipe-results-count" ref={searchCountText}>
              {searchCount}
            </span>
          </div>
          <RecipeResults
            recipeList={recipeList}
            setRecipeList={setRecipeList}
            moreResultsLink={moreResultsLink}
            setMoreResultsLink={setMoreResultsLink}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            loadMoreIcon={loadMoreIcon}
            setLoadMoreIcon={setLoadMoreIcon}
          ></RecipeResults>
        </div>
        <button
          className="discover-home button"
          ref={discoverButton}
          onClick={() => {
            navigate("/discover");
          }}
        >
          <FontAwesomeIcon
            icon={faCompass}
            className="discover-icon button-icon"
          />
          discover more
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
