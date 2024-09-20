import "./RecipePane.css";
import RecipeTile from "../RecipeTile/RecipeTile";

export default function RecipePane({ recipeList }) {
  return (
    <div className="recipe-pane">
      <div className="recipe-pane-container">
        {recipeList.map((recipe, index) => (
          <RecipeTile key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
