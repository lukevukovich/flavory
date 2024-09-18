import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { getRecipes } from "../../utils/RecipeAPI";

export default function SearchBar({ setRecipeList }) {
  // State for search input
  const [search, setSearch] = useState("");
  const [previousSearch, setPreviousSearch] = useState("");

  // Ref for clear button
  const clearButton = useRef(null);

  // Show clear button when search input is not empty
  useEffect(() => {
    if (search === "") {
      clearButton.current.style.visibility = "hidden";
    } else {
      clearButton.current.style.visibility = "visible";
    }
  }, [search]);

  async function searchRecipes() {
    if (search === "") {
      return;
    }

    if (search === previousSearch) {
      return;
    }

    const result = await getRecipes(search);
    setRecipeList(result.hits);
    setPreviousSearch(search);
  }

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
          setSearch(e.target.value.toLowerCase());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchRecipes();
          }
        }}
      />
      <button
        ref={clearButton}
        onClick={() => {
          setSearch("");
          setRecipeList([]);
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
