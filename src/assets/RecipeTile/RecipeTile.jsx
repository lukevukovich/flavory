import "./RecipeTile.css";
import { getRecipeID } from "../../utils/RecipeAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarked } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

export default function RecipeTile({ recipe }) {
  // State for saved recipes
  const [saved, setSaved] = useState(false);
  const [saveIcon, setSaveIcon] = useState(faBookmark);

  // Ref for save button
  const saveButton = useRef(null);

  // Handle saving recipes
  function handleRecipeSave() {
    setSaved(!saved);
  }

  // Set save icon based on saved state
  useEffect(() => {
    if (saved) {
      setSaveIcon(faBookmarked);
    } else {
      setSaveIcon(faBookmark);
    }
  }, [saved]);

  return (
    <div
      className="recipe-tile"
      id={getRecipeID(recipe)}
      onClick={(e) => {
        // Open the recipe in a new tab
        if (e.target.tagName === "BUTTON" || e.target.tagName === "svg" || e.target.tagName === "path") {
          return;
        }
        window.open(recipe.recipe.url, "_blank", "noopener,noreferrer");
      }}
    >
      <img
        className="recipe-tile-image"
        src={recipe.recipe.image}
        alt={recipe.recipe.label.toLowerCase()}
      />
      <span className="recipe-tile-title">
        {recipe.recipe.label.toLowerCase()}
      </span>
      <span className="recipe-tile-source">
        {recipe.recipe.source.toLowerCase()}
      </span>
      <button
        className="button recipe-tile-save"
        ref={saveButton}
        onClick={() => {
          handleRecipeSave();
        }}
        onMouseEnter={() => {
          saveButton.current.style.opacity = "1.0";
        }}
        onMouseLeave={() => {
          saveButton.current.style.opacity = "0.7";
        }}
      >
        <FontAwesomeIcon icon={saveIcon}></FontAwesomeIcon>
      </button>
    </div>
  );
}
