import "./Saved.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  faBookmark,
  faCompass,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeResults from "../../assets/RecipeResults/RecipeResults";
import { getSavedRecipes } from "../../utils/RecipeAPI";
import { checkSignInStatus } from "../../utils/Auth";
import { searchSavedRecipes } from "../../utils/Search";
import { signIn } from "../../utils/Auth";

// Saved recipes page
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
  const signInButton = useRef(null);
  const homeButton = useRef(null);
  const searchCountText = useRef(null);

  // States for recipe list and searching
  const [signedIn, setSignedIn] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipeIcon, setSavedRecipeIcon] = useState(faBookmark);
  const [savedRecipeText, setSavedRecipeText] = useState("saved recipes");
  const savedRecipeStates = [
    savedRecipeIcon,
    setSavedRecipeIcon,
    savedRecipeText,
    setSavedRecipeText,
  ];

  // Load saved recipes
  async function loadSavedRecipes(isSignedIn) {
    if (!isSignedIn) {
      setHeadingText("sign in to view your saved recipes!");
      searchBar.current.style.display = "none";
      homeButton.current.style.display = "none";
      signInButton.current.style.display = "flex";
      discoverButton.current.style.marginBottom = "122px";
      recipePane.current.style.display = "none";
      return;
    }

    setIsLoading(true);
    const savedRecipes = await getSavedRecipes();
    setRecipeList(savedRecipes.recipes);
    if (savedRecipes.recipes.length > 0) {
      if (savedRecipes.recipes.length === 1) {
        setSearchCount("1 recipe");
      } else {
        setSearchCount(savedRecipes.recipes.length + " recipes");
      }
    }
    setIsLoading(false);
    return savedRecipes.recipes;
  }

  // Update saved recipes
  async function updateSavedRecipes(isSignedIn) {
    const newSavedRecipes = await loadSavedRecipes(isSignedIn);
    newSavedRecipes.sort((a, b) =>
      a.recipe.label.localeCompare(b.recipe.label)
    );
    setOriginalRecipeList(newSavedRecipes);
  }

  async function useEffectLoad() {
    const { isSignedIn, user } = await checkSignInStatus();
    setSignedIn(isSignedIn);
    const search = searchParams.get("search");
    if (search === null) {
      navigate("/saved");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    updateSavedRecipes(isSignedIn);
  }

  // Handle all load operations
  useEffect(() => {
    useEffectLoad();
  }, []);

  // Set states for recipe list
  useEffect(() => {
    if (recipeList.length === 0) {
      searchBar.current.querySelector("input").disabled = true;
      if (signedIn) {
        homeButton.current.style.display = "flex";
        if (isLoading === false) {
          setHeadingText(
            "no saved recipes yet. discover something new to try!"
          );
        }
      }
      recipePane.current.style.display = "none";
      discoverButton.current.style.display = "flex";
    } else {
      searchBar.current.querySelector("input").disabled = false;
      setHeadingText("a taste of your favorites!");
      searchBar.current.style.display = "flex";
      recipePane.current.style.display = "flex";
      discoverButton.current.style.display = "none";
      homeButton.current.style.display = "none";
      signInButton.current.style.display = "none";
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
          savedRecipeStates={savedRecipeStates}
        ></SearchBar>
        <div className="saved-recipe-panel" ref={recipePane}>
          <div className="saved-recipe-results-panel">
            <span className="saved-recipe-results">
              <FontAwesomeIcon
                icon={savedRecipeStates[0]}
                className="saved-recipe-results-icon"
              ></FontAwesomeIcon>
              {savedRecipeStates[2]}
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
            savedRecipeList={originalRecipeList}
            setSavedRecipeList={setOriginalRecipeList}
            setSearchCount={setSearchCount}
          ></RecipeResults>
        </div>
        <button
          className="sign-in-saved button"
          ref={homeButton}
          onClick={async () => {
            navigate("/");
          }}
        >
          <FontAwesomeIcon
            icon={faHome}
            className="discover-icon button-icon"
          />
          home
        </button>
        <button
          className="sign-in-saved button"
          ref={signInButton}
          onClick={async () => {
            const success = await signIn();
            if (success) {
              window.location.reload();
            }
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            className="discover-icon button-icon"
          />
          sign in
        </button>
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
