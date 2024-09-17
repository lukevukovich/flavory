const axios = require("axios");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

// Get the Edamam API credentials from the environment
const EDAMAM_APP_ID = defineSecret("APP_ID");
const EDAMAM_APP_KEY = defineSecret("APP_KEY");

// Cloud function to handle Edamam API requests
exports.getRecipes = onRequest(async (req, res) => {
  try {
    // Get query parameters from the request
    const recipeQuery = req.query.q || "";
    const calorieRange = req.query.calories || "";

    // Construct the API URL
    let url = `https://api.edamam.com/search?q=${recipeQuery}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

    // Add calorie filter if provided
    if (calorieRange) {
      url += `&calories=${calorieRange}`;
    }

    // Make the API request to Edamam
    const response = await axios.get(url);

    // Respond with the API data
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});
