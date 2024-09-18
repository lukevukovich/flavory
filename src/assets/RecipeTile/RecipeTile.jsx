import "./RecipeTile.css";

export default function RecipeTile({ recipe }) {
  return (
    <div className="recipe-tile">
      <img className="recipe-tile-image" src={recipe.recipe.image} alt={recipe.recipe.label.toLowerCase()} />
      <text className="recipe-tile-title">{recipe.recipe.label.toLowerCase()}</text>
    </div>
  );
}
