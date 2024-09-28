// Helper function to search for saved recipes
export function searchSavedRecipes(recipeList, query) {
  try {
    let newRecipeList = recipeList.filter((recipe) => {
      return recipe.recipe.label.toLowerCase().includes(query.toLowerCase());
    });

    newRecipeList = { hits: newRecipeList };
    return newRecipeList;
  } catch (error) {
    return { hits: [] };
  }
}
