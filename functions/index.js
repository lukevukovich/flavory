const axios = require("axios");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// Get the Edamam API credentials from the environment
const EDAMAM_APP_ID = defineSecret("APP_ID");
const EDAMAM_APP_KEY = defineSecret("APP_KEY");
const EDAMAM_API_URL = "https://api.edamam.com/api/recipes/v2";

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

      // Respond with the API data
      res.status(200).json(response.data);
    } catch (error) {
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

      // Respond with the API data
      res.status(200).json(response.data);
    } catch (error) {
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
      res.status(500).json({ error: "Error fetching recipe by ID" });
    }
  }
);
