import "./RecipePane.css";
import RecipeTile from "../RecipeTile/RecipeTile";
import { getRecipeID } from "../../utils/RecipeAPI";

export default function RecipePane({ recipeList }) {
  return (
    <div className="recipe-pane">
      <div className="recipe-pane-container">
        {recipeList.map((recipe) => (
          <RecipeTile key={getRecipeID(recipe)} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
