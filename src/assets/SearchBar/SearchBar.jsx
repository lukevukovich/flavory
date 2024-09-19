import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark, faLemon } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatNumber } from "../../utils/Number";
import "../../App.css";

export default function SearchBar({
  getRecipes,
  setRecipeList,
  setMoreResultsLink,
  searchCount,
  setSearchCount,
  searchCountText,
  isLoading,
  setIsLoading,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for search input
  const [search, setSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(faSearch);

  // Refs
  const inputBar = useRef(null);
  const clearButton = useRef(null);
  const searchButton = useRef(null);

  // Search for recipes
  async function searchRecipes(searchQuery) {
    const searchString = searchQuery || search;

    if (searchString === "") {
      return;
    }

    if (searchString === previousSearch) {
      return;
    }

    searchButton.current.disabled = true;
    setSearchIcon(faLemon);
    setIsLoading(true);

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
      inputBar.current.placeholder = "no recipes found, try again";
      setSearch("");
    }
    setPreviousSearch(searchString);

    if (result.count > 0) {
      setSearchCount(formatNumber(result.count) + " recipes");
    } else {
      setSearchCount(null);
    }

    setIsLoading(false);
    setSearchIcon(faSearch);
    searchButton.current.disabled = false;
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
        className="button search-bar-search-button"
        ref={searchButton}
        onClick={() => {
          searchRecipes();
        }}
      >
        <FontAwesomeIcon
          icon={searchIcon}
          className={`${isLoading ? "loading-icon" : ""}`}
        ></FontAwesomeIcon>
      </button>
      <div className="search-bar-panel">
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
    </div>
  );
}
