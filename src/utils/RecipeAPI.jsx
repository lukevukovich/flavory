const GET_RECIPES_URL = "https://getrecipes-tshqabnweq-uc.a.run.app";
const GET_RECIPE_BY_ID_URL = "https://getrecipebyid-tshqabnweq-uc.a.run.app";

// Query recipes from the Edamam API and Firebase cloud function
export async function getRecipes(query, from, to) {
  try {
    const response = await fetch(`${GET_RECIPES_URL}?q=${query}`, {
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

// Query a recipe by ID from the Edamam API and Firebase cloud function
export async function getRecipeByID(id) {
  try {
    const response = await fetch(`${GET_RECIPE_BY_ID_URL}?id=${id}`, {
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
