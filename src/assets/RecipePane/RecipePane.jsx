import RecipeTile from "../RecipeTile/RecipeTile";
import "./RecipePane.css";

export default function RecipePane({ recipeList }) {
  return (
    <div className="recipe-pane">
      {recipeList.map((recipe) => (
        <RecipeTile key={recipe._links.self.href} recipe={recipe} />
      ))}
    </div>
  );
}