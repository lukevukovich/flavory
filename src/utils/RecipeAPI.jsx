import { checkSignInStatus } from "./Auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const GET_RECIPES_API = "https://getrecipes-v4rowkce3a-uc.a.run.app";
const GET_NEXT_RECIPES_API = "https://getnextrecipes-v4rowkce3a-uc.a.run.app";
const GET_RECIPE_BY_ID_API = "https://getrecipebyid-v4rowkce3a-uc.a.run.app";

// Query recipes from the Edamam API and Firebase cloud function
export async function getRecipes(query) {
  try {
    // Check if the user is signed in and get the user object if they are
    const { isSignedIn, user } = await checkSignInStatus();

    // Prepare the headers for the request
    const headers = {
      "Content-Type": "application/json",
    };

    // If the user is signed in, add the user-id to the headers
    if (isSignedIn && user) {
      headers["user-id"] = user.uid; // Assuming `user.uid` contains the Firebase user ID
    }

    // Make the request to the API
    const response = await fetch(`${GET_RECIPES_API}?q=${query}`, {
      method: "GET",
      headers: headers, // Use the headers object with or without the user-id
    });

    // Check if the response is OK
    if (!response.ok) {
      return {};
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    return {};
  }
}

// Query the next page of recipes from the Edamam API and Firebase cloud function
export async function getNextRecipes(query, cont) {
  try {
    // Check if the user is signed in and get the user object if they are
    const { isSignedIn, user } = await checkSignInStatus();

    // Prepare the headers for the request
    const headers = {
      "Content-Type": "application/json",
    };

    // If the user is signed in, add the user-id to the headers
    if (isSignedIn && user) {
      headers["user-id"] = user.uid; // Assuming `user.uid` contains the Firebase user ID
    }

    // Make the request to the API
    const response = await fetch(
      `${GET_NEXT_RECIPES_API}?q=${query}&cont=${cont}`,
      {
        method: "GET",
        headers: headers, // Use the headers object with or without the user-id
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      return {};
    }

    // Parse and return the response data
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

// Function to save or unsave a recipe
export async function saveRecipe(recipe) {
  // Only save the necessary fields
  const itemsToSave = ["image", "label", "source", "url", "userId"];
  for (let key in recipe.recipe) {
    if (!itemsToSave.includes(key)) {
      delete recipe.recipe[key];
    }
  }

  const functions = getFunctions();
  const saveRecipeFunction = httpsCallable(functions, "saveRecipe");

  try {
    await saveRecipeFunction({ recipe });
  } catch (error) {
    throw new Error(`Error saving recipe: ${error.message}`);
  }
}

// Function to get saved recipes
export async function getSavedRecipes() {
  const functions = getFunctions();
  const getSavedRecipesFunction = httpsCallable(functions, "getSavedRecipes");

  try {
    const result = await getSavedRecipesFunction();
    return result.data;
  } catch (error) {
    return { recipes: [] };
  }
}

// Extract the recipe ID from the recipe hit
export function getRecipeID(recipe_hit) {
  return recipe_hit._links.self.href.split("/")[6].split("?")[0];
}
