import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { getRecipes } from "../../utils/RecipeAPI";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar({
  setRecipeList,
  setMoreResultsLink,
  setSearchCount,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State for search input
  const [search, setSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");

  // Ref for clear button
  const clearButton = useRef(null);

  // Search for recipes
  async function searchRecipes() {
    if (search === "") {
      return;
    }

    if (search === previousSearch) {
      return;
    }

    const result = await getRecipes(search);
    if (result.hits.length > 0) {
      setRecipeList(result.hits);
      try {
        setMoreResultsLink(result._links.next.href);
      } catch (error) {
        setMoreResultsLink(null);
      }
    } else {
      setRecipeList([]);
      setMoreResultsLink(null);
    }
    setPreviousSearch(search);

    if (result.count > 0) {
      setSearchCount(result.count + " recipes");
    } else {
      setSearchCount(null);
    }
  }

  // Set search input on load
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null) {
      setSearch(search);
      setPreviousSearch(search);
    } else {
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

  return (
    <div className="search-bar">
      <button
        onClick={() => {
          searchRecipes();
        }}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      <input
        type="text"
        placeholder="search for recipes..."
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
