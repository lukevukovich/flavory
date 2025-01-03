import "./Home.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  faBookmark,
  faCompass,
  faSearch,
  faUser,
  faLemon,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecipeResults from "../../assets/RecipeResults/RecipeResults";
import { getRecipes } from "../../utils/RecipeAPI";
import { checkSignInStatus, signIn } from "../../utils/Auth";
import LoadingScreen from "../../assets/LoadingScreen/LoadingScreen";

// Home page
export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs for home page elements
  const searchBar = useRef(null);
  const recipePane = useRef(null);
  const discoverButton = useRef(null);
  const savedButton = useRef(null);
  const signInButton = useRef(null);
  const searchCountText = useRef(null);
  const headingElement = useRef(null);

  // State for random saying
  const [saying, setSaying] = useState("");

  // States for recipe list and searching
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);
  const [searchCount, setSearchCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  // State for sign in
  const [signedIn, setSignedIn] = useState(false);

  // Handle sign in on load
  async function handleSignIn() {
    signInButton.current.disabled = true;
    const { isSignedIn, user } = await checkSignInStatus();
    if (isSignedIn) {
      signInButton.current.style.display = "none";
      savedButton.current.style.display = "flex";
    } else {
      signInButton.current.disabled = false;
    }

    setSignedIn(isSignedIn);
    setLoadingScreen(false);
  }

  // Set random saying on load
  useEffect(() => {
    handleSignIn();

    const search = searchParams.get("search");
    if (search === null) {
      navigate("/");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

    const randomIndex = Math.floor(Math.random() * sayings.length);
    setSaying(sayings[randomIndex]);
  }, []);

  // Set states for recipe list, manage buttons
  useEffect(() => {
    if (recipeList.length === 0) {
      recipePane.current.style.display = "none";
      discoverButton.current.style.display = "flex";
      if (signedIn) {
        savedButton.current.style.display = "flex";
        signInButton.current.style.display = "none";
      } else {
        signInButton.current.style.display = "flex";
        savedButton.current.style.display = "none";
      }
    } else {
      recipePane.current.style.display = "flex";
      discoverButton.current.style.display = "none";
      savedButton.current.style.display = "none";
      signInButton.current.style.display = "none";
    }
  }, [recipeList]);

  return (
    <div>
      <Header setRecipeList={setRecipeList}></Header>
      <LoadingScreen loadingScreenBool={loadingScreen}></LoadingScreen>
      <div className="home-search-panel">
        <span className="heading-text home-search-prompt" ref={headingElement}>
          {saying}
        </span>
        <SearchBar
          page={""}
          getRecipes={getRecipes}
          recipeList={recipeList}
          setRecipeList={setRecipeList}
          setMoreResultsLink={setMoreResultsLink}
          searchCount={searchCount}
          setSearchCount={setSearchCount}
          searchCountText={searchCountText}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          savedRecipeList={null}
          searchBar={searchBar}
          savedRecipeStates={null}
          headingElement={headingElement}
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
            savedRecipeList={null}
            setSavedRecipeList={null}
            setSearchCount={null}
          ></RecipeResults>
        </div>
        <button
          className="sign-in-home button"
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
          className="saved-home button"
          ref={savedButton}
          onClick={() => {
            navigate("/saved");
          }}
        >
          <FontAwesomeIcon
            icon={faBookmark}
            className="discover-icon button-icon"
          />
          saved recipes
        </button>
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
