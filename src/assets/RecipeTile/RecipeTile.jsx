import "./RecipeTile.css";
import { getRecipeID } from "../../utils/RecipeAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarked } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { saveRecipe } from "../../utils/RecipeAPI";
import { checkSignInStatus } from "../../utils/Auth";

// Single recipe tile component
export default function RecipeTile({
  recipe,
  recipeList,
  setRecipeList,
  savedRecipeList,
  setSavedRecipeList,
  setSearchCount,
}) {
  // Ref for save button
  const saveButton = useRef(null);

  // State for saved recipes
  const [saved, setSaved] = useState(false);
  const [saveIcon, setSaveIcon] = useState(faBookmark);

  // Handle save button visibility
  async function handleSaveButton() {
    const { isSignedIn, user } = await checkSignInStatus();

    saveButton.current.disable = true;

    if (isSignedIn) {
      saveButton.current.disabled = false;
      saveButton.current.style.visibility = "visible";
    }
  }

  // Set save states on load
  useEffect(() => {
    handleSaveButton();
    setSaved(recipe.recipe.saved);
  }, []);

  // Handle saving recipes
  async function handleRecipeSave() {
    const prev = saved;
    try {
      // Disable save button while saving
      saveButton.current.disabled = true;
      setSaved(!saved);

      // If un-saving a recipe
      if (savedRecipeList) {
        // Un-save the recipe
        if (prev === true && !saved === false) {
          const newRecipeList = recipeList.filter(
            (r) => r.recipe.url !== recipe.recipe.url
          );
          setRecipeList(newRecipeList);

          const newSavedRecipeList = savedRecipeList.filter(
            (r) => r.recipe.url !== recipe.recipe.url
          );
          setSavedRecipeList(newSavedRecipeList);

          if (newRecipeList.length > 0) {
            setSearchCount(newRecipeList.length + " recipes");
          } else {
            setRecipeList(newSavedRecipeList);
            setSearchCount(newSavedRecipeList.length + " recipes");
          }

          setSaved(true);
          saveButton.current.disabled = false;
        }
      }

      // Save the recipe
      await saveRecipe(recipe);
    } catch (error) {
      setSaved(prev);
    }

    try {
      saveButton.current.disabled = false;
    } catch (error) {}
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
        if (
          e.target.tagName === "BUTTON" ||
          e.target.tagName === "svg" ||
          e.target.tagName === "path"
        ) {
          return;
        }
        window.open(recipe.recipe.url, "_blank", "noopener,noreferrer");
      }}
      onMouseEnter={() => {
        saveButton.current.style.opacity = "1.0";
      }}
      onMouseLeave={() => {
        saveButton.current.style.opacity = "0.7";
      }}
    >
      <img className="recipe-tile-image" src={recipe.recipe.image} />
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
      >
        <FontAwesomeIcon icon={saveIcon}></FontAwesomeIcon>
      </button>
    </div>
  );
}
