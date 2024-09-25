import "./Saved.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { faBookmark, faCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeResults from "../../assets/RecipeResults/RecipeResults";
import { getRecipes } from "../../utils/RecipeAPI";
import { getSavedRecipes } from "../../utils/RecipeAPI";
import { checkSignInStatus } from "../../utils/Auth";

export default function Saved() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs
  const recipePane = useRef(null);
  const discoverButton = useRef(null);
  const searchCountText = useRef(null);

  // States for recipe list and searching
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved recipes
  async function loadSavedRecipes() {
    const {isSignedIn, user} = await checkSignInStatus();
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    const savedRecipes = await getSavedRecipes();
    setRecipeList(savedRecipes.recipes);
    if (savedRecipes.recipes.length > 0) {
      setSearchCount(savedRecipes.recipes.length + " recipes");
    }
    setIsLoading(false);
  }

  // Set random saying on load
  useEffect(() => {
    const search = searchParams.get("search");
    if (search === null) {
      navigate("saved");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    loadSavedRecipes();
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
      <div className="saved-search-panel">
        <span className="heading-text saved-search-prompt">
          a taste of your favorites!
        </span>
        <SearchBar
          page={"saved"}
          getRecipes={getRecipes}
          setRecipeList={setRecipeList}
          setMoreResultsLink={setMoreResultsLink}
          searchCount={searchCount}
          setSearchCount={setSearchCount}
          searchCountText={searchCountText}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        ></SearchBar>
        <div className="saved-recipe-panel" ref={recipePane}>
          <div className="saved-recipe-results-panel">
            <span className="saved-recipe-results">
              <FontAwesomeIcon
                icon={faBookmark}
                className="saved-recipe-results-icon"
              ></FontAwesomeIcon>
              saved recipes
            </span>
            <span className="saved-recipe-results-count" ref={searchCountText}>
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
          ></RecipeResults>
        </div>
        <button
          className="discover-saved button"
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
