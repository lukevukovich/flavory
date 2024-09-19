import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { getRecipes } from "../../utils/RecipeAPI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatNumber } from "../../utils/Number";

export default function SearchBar({
  recipeList,
  setRecipeList,
  setMoreResultsLink,
  searchCount,
  setSearchCount,
  searchCountText,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for search input
  const [search, setSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");

  // Ref for clear button
  const inputBar = useRef(null);
  const clearButton = useRef(null);

  // Search for recipes
  async function searchRecipes(searchQuery) {
    const searchString = searchQuery || search;

    if (searchString === "") {
      return;
    }

    if (searchString === previousSearch) {
      return;
    }

    const result = await getRecipes(searchString);
    if (result.hits.length > 0) {
      setRecipeList(result.hits);
      inputBar.current.placeholder = "search for recipes";
      try {
        setMoreResultsLink(result._links.next.href);
      } catch (error) {
        setMoreResultsLink(null);
      }
    } else {
      setRecipeList([]);
      setMoreResultsLink(null);
      inputBar.current.placeholder = "no recipes found, search again";
      setSearch("");
    }
    setPreviousSearch(searchString);

    if (result.count > 0) {
      setSearchCount(formatNumber(result.count) + " recipes");
    } else {
      setSearchCount(null);
    }
  }

  // Set search input on load
  useEffect(() => {
    const searchString = searchParams.get("search");
    if (searchString !== null) {
      setSearch(searchString);
      setPreviousSearch(searchString);
      searchRecipes(searchString);
    } else {
      inputBar.current.placeholder = "search for recipes";
      setSearch("");
    }
  }, []);

  // Show clear button when search input is not empty
  useEffect(() => {
    if (search === "") {
      clearButton.current.style.visibility = "hidden";
    } else {
      clearButton.current.style.visibility = "visible";
    }
  }, [search]);

  // Show search count text when search count is not null
  useEffect(() => {
    if (searchCount === null) {
      searchCountText.current.style.display = "none";
    } else {
      searchCountText.current.style.display = "flex";
    }
  }, [searchCount]);

  return (
    <div className="search-bar">
      <button
        className="search-bar-search-button"
        onClick={() => {
          searchRecipes();
        }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <input
        type="text"
        className="search-bar-input"
        ref={inputBar}
        placeholder="search for recipes"
        value={search}
        onChange={(e) => {
          setPreviousSearch(search);
          setSearch(e.target.value.toLowerCase());
          if (e.target.value === "") {
            navigate("/");
          } else {
            navigate("/?search=" + e.target.value.toLowerCase());
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchRecipes();
            e.currentTarget.blur();
          }
        }}
      />
      <button
        ref={clearButton}
        className="search-bar-clear-button"
        onClick={() => {
          setSearch("");
          setPreviousSearch("");
          setRecipeList([]);
          setMoreResultsLink(null);
          navigate("/");
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
