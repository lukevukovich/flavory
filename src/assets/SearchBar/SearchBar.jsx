import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faXmark,
  faLemon,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatNumber } from "../../utils/Number";
import "../../App.css";

// Search bar component
// getRecipes is function passed to component from parent. Allows for flexible searching
export default function SearchBar({
  page,
  getRecipes,
  recipeList,
  setRecipeList,
  setMoreResultsLink,
  searchCount,
  setSearchCount,
  searchCountText,
  isLoading,
  setIsLoading,
  savedRecipeList,
  searchBar,
  savedRecipeStates,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Refs for search bar elements
  const inputBar = useRef(null);
  const searchButton = useRef(null);
  const clearButton = useRef(null);

  // States for search bar
  const [search, setSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(faSearch);

  // Search for recipes
  async function searchRecipes(searchQuery) {
    const searchString = searchQuery || search;

    if (searchString === "") {
      return;
    }

    if (searchString === previousSearch) {
      return;
    }

    setIsLoading(true);

    let newRecipeList = [];
    const result = await getRecipes(savedRecipeList || recipeList, searchString);
    if (result.hits.length > 0) {
      newRecipeList = result.hits;
      setRecipeList(newRecipeList);
      if (savedRecipeStates) {
        savedRecipeStates[1](faSearch);
        savedRecipeStates[3]("search results");
      }
      inputBar.current.placeholder = `search for ${
        page ? page + " " : ""
      }recipes`;
      try {
        setMoreResultsLink(result._links.next.href);
      } catch (error) {
        setMoreResultsLink(null);
      }
      window.scrollTo(0, 0);
    } else {
      if (savedRecipeList) {
        newRecipeList = savedRecipeList;
        setRecipeList(newRecipeList);
      }
      setMoreResultsLink(null);
      let prompt;
      if (page === "") {
        prompt = page;
      } else {
        prompt = page + " ";
      }
      inputBar.current.placeholder = `no ${prompt}recipes found, try again`;
      setSearch("");
    }
    setPreviousSearch(searchString);

    let searchCount;
    try {
      searchCount = formatNumber(result.count) + " recipe";
    } catch (error) {
      searchCount = formatNumber(newRecipeList.length) + " recipe";
    }
    if (newRecipeList.length > 1) {
      searchCount += "s";
    }
    setSearchCount(searchCount);

    setIsLoading(false);
  }

  // Search for saved recipes on load
  async function searchSavedRecipesOnLoad() {
    if (savedRecipeList) {
      if (recipeList.length > 0 && searchParams.get("search") !== null) {
        setPreviousSearch("");
        await searchRecipes(search);
      }
    }
  }

  // Handle search on load
  useEffect(() => {
    searchSavedRecipesOnLoad();
  }, [recipeList]);

  // Set search button to loading state
  useEffect(() => {
    if (isLoading) {
      searchButton.current.disabled = true;
      clearButton.current.disabled = true;
      searchBar.current.querySelector("input").disabled = true;
      setSearchIcon(faLemon);
    } else {
      searchButton.current.disabled = false;
      clearButton.current.disabled = false;
      searchBar.current.querySelector("input").disabled = false;
      setSearchIcon(faSearch);
    }
  }, [isLoading]);

  // Handle scroll and resize events for search bar snapping
  function handleScroll() {
    const searchBarY = searchBar.current.getBoundingClientRect().top;
    if (searchBarY <= 84) {
      if (window.innerWidth <= 930) {
        searchBar.current.classList.add("search-bar-scroll");
      } else {
        searchBar.current.classList.remove("search-bar-scroll");
      }
    } else {
      searchBar.current.classList.remove("search-bar-scroll");
    }
  }

  // Handle resize events for search bar resizing
  function handleResize() {
    const searchBarY = searchBar.current.getBoundingClientRect().top;
    if (window.innerWidth <= 930) {
      searchBar.current.classList.add("search-bar-resize");
      if (searchBarY <= 84) {
        searchBar.current.classList.add("search-bar-scroll");
      } else {
        searchBar.current.classList.remove("search-bar-scroll");
      }
    } else {
      searchBar.current.classList.remove("search-bar-resize");
      searchBar.current.classList.remove("search-bar-scroll");
    }
  }

  // Handle scroll and resize events, and search on load
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    if (window.innerWidth <= 930) {
      searchBar.current.classList.add("search-bar-resize");
    }

    const searchString = searchParams.get("search");
    if (searchString !== null) {
      setSearch(searchString);
      if (window.location.pathname === "/") {
        setPreviousSearch(searchString);
        searchRecipes(searchString);
      }
    } else {
      let prompt;
      if (page) {
        prompt = page + " ";
      } else {
        prompt = "";
      }
      inputBar.current.placeholder = `search for ${prompt}recipes`;
      setSearch("");
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
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
    <div className="search-bar" ref={searchBar}>
      <div className="search-bar-panel">
        <input
          type="text"
          className="search-bar-input"
          ref={inputBar}
          placeholder={`search for ${page ? page + " " : ""}recipes`}
          value={search}
          onChange={(e) => {
            setPreviousSearch(search);
            setSearch(e.target.value.toLowerCase());
            if (e.target.value === "") {
              if (savedRecipeList) {
                setRecipeList(savedRecipeList || []);
                const newRecipeList = savedRecipeList || [];
                if (newRecipeList.length === 1) {
                  setSearchCount(newRecipeList.length + " recipe");
                } else {
                  setSearchCount(newRecipeList.length + " recipes");
                }
                if (savedRecipeStates) {
                  savedRecipeStates[1](faBookmark);
                  savedRecipeStates[3]("saved recipes");
                }
              }
              navigate("/" + page);
            } else {
              let goToSearch;
              if (page === "") {
                goToSearch = page;
              } else {
                goToSearch = "/" + page;
              }
              navigate(goToSearch + "?search=" + e.target.value.toLowerCase());
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
            if (savedRecipeList) {
              setRecipeList(savedRecipeList || []);
              const newRecipeList = savedRecipeList || [];
              if (newRecipeList.length > 0) {
                if (newRecipeList.length === 1) {
                  setSearchCount(newRecipeList.length + " recipe");
                } else {
                  setSearchCount(newRecipeList.length + " recipes");
                }
              }
              if (savedRecipeStates) {
                savedRecipeStates[1](faBookmark);
                savedRecipeStates[3]("saved recipes");
              }
            }
            navigate("/" + page);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
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
    </div>
  );
}
