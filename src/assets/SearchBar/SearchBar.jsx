import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

export default function () {
  // State for search input
  const [search, setSearch] = useState("");

  // Ref for clear button
  const clearButton = useRef(null);

  // Show clear button when search input is not empty
  useEffect(() => {
    if (search == "") {
      clearButton.current.style.visibility = "hidden";
    } else {
      clearButton.current.style.visibility = "visible";
    }
  }, [search]);

  return (
    <div className="search-bar">
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      <input
        type="text"
        placeholder="search for recipes..."
        value={search}
        onInput={(e) => {
          setSearch(e.target.value.toLowerCase());
        }}
      />
      <button
        ref={clearButton}
        onClick={() => {
          setSearch("");
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}
