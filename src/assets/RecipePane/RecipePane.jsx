import "./RecipePane.css";
import RecipeTile from "../RecipeTile/RecipeTile";

// Recipe pane component
export default function RecipePane({
  recipeList,
  setRecipeList,
  savedRecipeList,
  setSavedRecipeList,
  setSearchCount,
}) {
  return (
    <div className="recipe-pane">
      <div className="recipe-pane-container">
        {recipeList.map((recipe, index) => (
          <RecipeTile
            key={index}
            recipe={recipe}
            recipeList={recipeList}
            setRecipeList={setRecipeList}
            savedRecipeList={savedRecipeList}
            setSavedRecipeList={setSavedRecipeList}
            setSearchCount={setSearchCount}
          />
        ))}
      </div>
    </div>
  );
}
