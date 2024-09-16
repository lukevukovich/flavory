import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

export default function () {
  const [search, setSearch] = useState("");

  const clearRef = useRef(null);

  useEffect(() => {
    if (search === "") {
      clearRef.current.style.visibility = "hidden";
    } else {
      clearRef.current.style.visibility = "visible";
    }
  }
  , [search]);

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
      <button ref={clearRef}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => {
            setSearch("");
          }}
        />
      </button>
    </div>
  );
}
