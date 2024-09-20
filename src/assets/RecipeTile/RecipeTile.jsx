import "./RecipeTile.css";
import { getRecipeID } from "../../utils/RecipeAPI";

export default function RecipeTile({ recipe }) {
  return (
    <div
      className="recipe-tile"
      onClick={(e) => {
        // Open the recipe in a new tab
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
    </div>
  );
}
