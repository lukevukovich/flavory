const axios = require("axios");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onRequest, onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// Get the Edamam API credentials from the environment
const EDAMAM_APP_ID = defineSecret("APP_ID");
const EDAMAM_APP_KEY = defineSecret("APP_KEY");
const EDAMAM_API_URL = "https://api.edamam.com/api/recipes/v2";

// Get the Firestore collection name for saved recipes
const SAVED_RECIPES_COLLECTION = "savedRecipes";

// Initialize the Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Cloud function to handle Edamam API queries
exports.getRecipes = onRequest(
  { cors: true, secrets: [EDAMAM_APP_ID, EDAMAM_APP_KEY] },
  async (req, res) => {
    try {
      // Get the Edamam API credentials
      const appId = await EDAMAM_APP_ID.value();
      const appKey = await EDAMAM_APP_KEY.value();

      // Get query parameters from the request
      const recipeQuery = req.query.q || "";
      const calorieRange = req.query.calories || "";

      // Construct the API URL
      let url = `${EDAMAM_API_URL}?type=public&q=${encodeURIComponent(
        recipeQuery
      )}&app_id=${appId}&app_key=${appKey}`;

      // Add calorie filter if provided
      if (calorieRange) {
        url += `&calories=${encodeURIComponent(calorieRange)}`;
      }

      // Make the API request to Edamam
      const response = await axios.get(url);

      // Set saved flag for each recipe
      const userId = req.headers["user-id"];
      for (let i = 0; i < response.data.hits.length; i++) {
        const recipe = response.data.hits[i];
        let saved = false;
        if (userId) {
          saved = await checkIfSaved(userId, getRecipeID(recipe));
        }
        response.data.hits[i].recipe.saved = saved;
      }

      // Respond with the API data
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Error fetching recipes" });
    }
  }
);

// Cloud function to handle Edamam API queries for the next page of results
exports.getNextRecipes = onRequest(
  { cors: true, secrets: [EDAMAM_APP_ID, EDAMAM_APP_KEY] },
  async (req, res) => {
    try {
      // Get the Edamam API credentials
      const appId = await EDAMAM_APP_ID.value();
      const appKey = await EDAMAM_APP_KEY.value();

      // Get query parameters from the request
      const recipeQuery = req.query.q;
      const continueID = req.query.cont;

      if (!recipeQuery) {
        return res.status(400).json({ error: "Recipe query is required" });
      }
      if (!continueID) {
        return res.status(400).json({ error: "Continue ID is required" });
      }

      // Construct the API URL
      let url = `${EDAMAM_API_URL}?type=public&q=${recipeQuery}&_cont=${continueID}&app_id=${appId}&app_key=${appKey}`;

      // Make the API request to Edamam
      const response = await axios.get(url);

      // Set saved flag for each recipe
      const userId = req.headers["user-id"];
      for (let i = 0; i < response.data.hits.length; i++) {
        const recipe = response.data.hits[i];
        let saved = false;
        if (userId) {
          saved = await checkIfSaved(userId, getRecipeID(recipe));
        }
        response.data.hits[i].recipe.saved = saved;
      }

      // Respond with the API data
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching next recipes:", error);
      res.status(500).json({ error: "Error fetching next recipes" });
    }
  }
);

// Cloud function to handle Edamam API queries by recipe ID
exports.getRecipeByID = onRequest(
  { cors: true, secrets: [EDAMAM_APP_ID, EDAMAM_APP_KEY] },
  async (req, res) => {
    try {
      // Get the Edamam API credentials
      const appId = await EDAMAM_APP_ID.value();
      const appKey = await EDAMAM_APP_KEY.value();

      // Get query parameters from the request
      const recipeID = req.query.id;

      if (!recipeID) {
        return res.status(400).json({ error: "Recipe ID is required" });
      }

      // Construct the API URL
      let url = `${EDAMAM_API_URL}/${encodeURIComponent(
        recipeID
      )}?type=public&app_id=${appId}&app_key=${appKey}`;

      // Make the API request to Edamam
      const response = await axios.get(url);

      // Respond with the API data
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      res.status(500).json({ error: "Error fetching recipe by ID" });
    }
  }
);

// Cloud function to save or unsave a recipe
exports.saveRecipe = onCall(async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to save or unsave a recipe."
    );
  }

  // Get the user ID and recipe data from the request
  const userId = request.auth.uid;
  let recipe = request.data.recipe;
  recipe.recipe.userId = userId;

  // Validate input data
  if (!recipe) {
    throw new functions.https.HttpsError("invalid-argument", "Missing recipe");
  }

  try {
    // Create a unique document ID using userId and recipeId
    const docId = `${userId}_${getRecipeID(recipe)}`;
    const docRef = db.collection(SAVED_RECIPES_COLLECTION).doc(docId);

    // Check if the document already exists
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      // If the document exists, remove it (unsave)
      await docRef.delete();
      return { success: true, message: "Recipe unsaved successfully." };
    } else {
      // If the document doesn't exist, save it
      await docRef.set({
        recipe: recipe,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, message: "Recipe saved successfully." };
    }
  } catch (error) {
    console.error("Error saving/unsaving recipe:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while saving/unsaving the recipe."
    );
  }
});

// Cloud function to get all saved recipes for a user
exports.getSavedRecipes = onCall(async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to retrieve saved recipes."
    );
  }

  // Get the user ID and recipe data from the request
  const userId = request.auth.uid;

  try {
    // Query Firestore to get all saved recipes for this user
    const savedRecipesSnapshot = await db
      .collection("savedRecipes")
      .where("recipe.recipe.userId", "==", userId)
      .get();

    // If no saved recipes found, return an empty array
    if (savedRecipesSnapshot.empty) {
      return { recipes: [] };
    }

    // Add each recipe to the array
    const savedRecipes = [];
    savedRecipesSnapshot.forEach((doc) => {
      let recipe = doc.data().recipe;
      recipe.recipe.saved = true;
      savedRecipes.push(recipe);
    });

    // Return the saved recipes
    return { recipes: savedRecipes };
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching saved recipes."
    );
  }
});

// Helper function to extract the recipe ID from the recipe hit
function getRecipeID(recipe_hit) {
  return recipe_hit._links.self.href.split("/")[6].split("?")[0];
}

// Helper function to check if a recipe is saved
async function checkIfSaved(userId, recipeId) {
  return db
    .collection(SAVED_RECIPES_COLLECTION)
    .doc(`${userId}_${recipeId}`)
    .get()
    .then((doc) => {
      return doc.exists;
    });
}
