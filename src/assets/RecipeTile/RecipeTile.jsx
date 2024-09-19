import "./RecipeTile.css";
import { getRecipeID } from "../../utils/RecipeAPI";
import { useNavigate } from "react-router-dom";

export default function RecipeTile({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      className="recipe-tile"
      id={getRecipeID(recipe)}
      onClick={(e) => {
        navigate(`/recipe/${e.currentTarget.id}`);
        console.log(e.currentTarget.id);
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
