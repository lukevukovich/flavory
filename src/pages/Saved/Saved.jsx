import "./Saved.css";
import "../../App.css";
import "../../assets/SearchBar/SearchBar.css";
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
import LoadingScreen from "../../assets/LoadingScreen/LoadingScreen";

// Saved recipes page
export default function Saved() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs for saved page elements
  const recipePane = useRef(null);
  const searchBar = useRef(null);
  const discoverButton = useRef(null);
  const signInButton = useRef(null);
  const homeButton = useRef(null);
  const searchCountText = useRef(null);
  const headingElement = useRef(null);

  // State for heading text
  const [headingText, setHeadingText] = useState("your saved recipes");

  // States for recipe lists and searching
  const [signedIn, setSignedIn] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [originalRecipeList, setOriginalRecipeList] = useState([]);
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
    setIsLoading(true);
    if (!isSignedIn) {
      setHeadingText("sign in to save recipes!");
      searchBar.current.style.display = "none";
      homeButton.current.style.display = "none";
      signInButton.current.style.display = "flex";
      discoverButton.current.style.marginBottom = "130px";
      recipePane.current.style.display = "none";
      return;
    }

    const result = await getSavedRecipes();
    const savedRecipes = result.recipes;
    if (savedRecipes.length > 0) {
      savedRecipes.sort((a, b) => a.recipe.label.localeCompare(b.recipe.label));
      if (savedRecipes.length === 1) {
        setSearchCount("1 recipe");
      } else {
        setSearchCount(savedRecipes.length + " recipes");
      }
    }
    setOriginalRecipeList(savedRecipes);
    setRecipeList(savedRecipes);
    setIsLoading(false);
  }

  // Handle auth, search, and load operations
  async function useEffectLoad() {
    const { isSignedIn, user } = await checkSignInStatus();
    setSignedIn(isSignedIn);
    const search = searchParams.get("search");
    if (search === null) {
      navigate("/saved");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    setIsLoading(false);
    await loadSavedRecipes(isSignedIn);
  }

  // Handle all load operations
  useEffect(() => {
    useEffectLoad();
  }, []);

  // Set states for recipe list, manage elements
  useEffect(() => {
    if (recipeList.length === 0) {
      searchBar.current.querySelector("input").disabled = true;
      if (signedIn) {
        homeButton.current.style.display = "flex";
        if (isLoading === false) {
          setHeadingText("no saved recipes");
          searchBar.current.querySelector("input").placeholder =
            "no saved recipes";
        }
      }
      recipePane.current.style.display = "none";
      discoverButton.current.style.display = "flex";
    } else {
      searchBar.current.querySelector("input").disabled = false;
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
      <LoadingScreen loadingScreenBool={isLoading}></LoadingScreen>
      <div className="saved-search-panel">
        <span className="heading-text saved-search-prompt" ref={headingElement}>
          <FontAwesomeIcon
            icon={faBookmark}
            className="heading-icon"
          ></FontAwesomeIcon>
          {headingText}
        </span>
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
          headingElement={headingElement}
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
