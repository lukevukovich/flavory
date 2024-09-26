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
import { getSavedRecipes } from "../../utils/RecipeAPI";
import { checkSignInStatus } from "../../utils/Auth";
import { searchSavedRecipes } from "../../utils/Search";

export default function Saved() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // States for saved recipes load
  const [originalRecipeList, setOriginalRecipeList] = useState([]);
  const [headingText, setHeadingText] = useState("a taste of your favorites!");

  // Refs
  const recipePane = useRef(null);
  const searchBar = useRef(null);
  const discoverButton = useRef(null);
  const searchCountText = useRef(null);

  // States for recipe list and searching
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved recipes
  async function loadSavedRecipes() {
    const { isSignedIn, user } = await checkSignInStatus();
    if (!isSignedIn) {
      setHeadingText("sign in to view your saved recipes!");
      return;
    }

    setIsLoading(true);
    const savedRecipes = await getSavedRecipes();
    setRecipeList(savedRecipes.recipes);
    if (savedRecipes.recipes.length > 0) {
      setSearchCount(savedRecipes.recipes.length + " recipes");
    }
    setIsLoading(false);
    return savedRecipes.recipes;
  }

  // Update saved recipes
  async function updateSavedRecipes() {
    const newSavedRecipes = await loadSavedRecipes();
    setOriginalRecipeList(newSavedRecipes);
  }

  async function useEffectLoad() {
    const { isSignedIn, user } = await checkSignInStatus();
    if (!isSignedIn) {
      searchBar.current.style.display = "none";
    }
    const search = searchParams.get("search");
    if (search === null) {
      navigate("/saved");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    updateSavedRecipes();
  }

  // Set random saying on load
  useEffect(() => {
    useEffectLoad();
  }, []);

  // Set states for recipe list
  useEffect(() => {
    if (recipeList.length === 0) {
      if (searchBar.current.style.display == "none") {
        discoverButton.current.style.marginBottom = "122px";
      }
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
        <span className="heading-text saved-search-prompt">{headingText}</span>
        <SearchBar
          page={"saved"}
          getRecipes={searchSavedRecipes}
          recipeList={recipeList}
          setRecipeList={setRecipeList}
          setMoreResultsLink={setMoreResultsLink}
          searchCount={searchCount}
          setSearchCount={setSearchCount}
          searchCountText={searchCountText}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          savedRecipeList={originalRecipeList}
          searchBar={searchBar}
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
