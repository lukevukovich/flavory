const GET_RECIPES_API = "https://getrecipes-tshqabnweq-uc.a.run.app";
const GET_NEXT_RECIPES_API = "https://getnextrecipes-tshqabnweq-uc.a.run.app";
const GET_RECIPE_BY_ID_API = "https://getrecipebyid-tshqabnweq-uc.a.run.app";

// Query recipes from the Edamam API and Firebase cloud function
export async function getRecipes(query) {
  try {
    const response = await fetch(`${GET_RECIPES_API}?q=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {};
  }
}

// Query the next page of recipes from the Edamam API and Firebase cloud function
export async function getNextRecipes(query, cont) {
  try {
    const response = await fetch(
      `${GET_NEXT_RECIPES_API}?q=${query}&cont=${cont}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {};
  }
}

// Query a recipe by ID from the Edamam API and Firebase cloud function
export async function getRecipeByID(id) {
  try {
    const response = await fetch(`${GET_RECIPE_BY_ID_API}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {};
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {};
  }
}

// Extract the recipe ID from the recipe hit
export function getRecipeID(recipe_hit) {
  return recipe_hit._links.self.href.split("/")[6].split("?")[0];
}
