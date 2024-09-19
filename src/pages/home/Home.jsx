import "./Home.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import SearchBar from "../../assets/SearchBar/SearchBar";
import { useState, useEffect, useRef } from "react";
import { sayings } from "../../utils/Sayings";
import { useNavigate, useSearchParams } from "react-router-dom";
import { faCompass, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRecipes } from "../../utils/RecipeAPI";
import RecipePane from "../../assets/RecipePane/RecipePane";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const recipePane = useRef(null);
  const discoverButton = useRef(null);

  // State for random saying
  const [saying, setSaying] = useState("");

  // State for recipe list and more results link
  const [recipeList, setRecipeList] = useState([]);
  const [moreResultsLink, setMoreResultsLink] = useState(null);

  // Search for recipes if search input is not empty
  async function searchRecipes(search) {
    if (search === "") {
      return;
    }
    const result = await getRecipes(search);
    if (result.hits.length > 0) {
      setRecipeList(result.hits);
    } else {
      setRecipeList([]);
    }
    try {
      setMoreResultsLink(result._links.next.href);
    } catch (error) {
      setMoreResultsLink(null);
    }
  }

  // Set random saying on load
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null) {
      searchRecipes(search);
      navigate("/?search=" + search);
    } else {
      navigate("/");
      setRecipeList([]);
      setMoreResultsLink(null);
    }

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
      <Header setRecipeList={setRecipeList}></Header>
      <div className="home-search-panel">
        <span className="home-search-prompt">{saying}</span>
        <SearchBar
          setRecipeList={setRecipeList}
          setMoreResultsLink={setMoreResultsLink}
        ></SearchBar>
        <div className="home-recipe-panel" ref={recipePane}>
          <span className="home-recipe-results">
            <FontAwesomeIcon
              icon={faSearch}
              className="home-recipe-results-icon"
            ></FontAwesomeIcon>
            search results
          </span>
          <RecipePane
            recipeList={recipeList}
            setRecipeList={setRecipeList}
            moreResultsLink={moreResultsLink}
            setMoreResultsLink={setMoreResultsLink}
          ></RecipePane>
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
          discover
        </button>
      </div>
      <Footer></Footer>
    </div>
  );
}
