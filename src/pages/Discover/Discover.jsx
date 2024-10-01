import "./Discover.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import { useEffect, useRef } from "react";
import { recipeTypes, recipeDescriptors } from "../../utils/RecipeData";
import { useState } from "react";
import { getRecipes } from "../../utils/RecipeAPI";
import RecipePane from "../../assets/RecipePane/RecipePane";
import {
  faRotateRight,
  faLemon,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Discover page
export default function Discover() {
  // Controllers for random recipes
  const NUMBER_OF_QUERIES = 4;
  const NUMBER_OF_RECIPES = 4;

  // States for recipe list
  const [titleList, setTitleList] = useState([]);
  const [recipeList, setRecipeList] = useState(
    Array(NUMBER_OF_QUERIES).fill([])
  );

  // Refs for discover page elements
  const refreshButton = useRef(null);
  const discoverHeading = useRef(null);

  // States for refreshing recipes
  const [loadMoreText, setLoadMoreText] = useState("load more");
  const [discoverText, setDiscoverText] = useState("discover new recipes");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(faRotateRight);

  // Generate random queries from recipe data with unique random types
  function generateRandomQueries() {
    let randomQueries = [];
    let randomTypes = new Set();

    while (randomTypes.size < Math.min(NUMBER_OF_QUERIES, recipeTypes.length)) {
      let randomType =
        recipeTypes[Math.floor(Math.random() * recipeTypes.length)];

      // Ensure the type hasn't already been used
      if (!randomTypes.has(randomType.toLowerCase())) {
        let randomDescriptor =
          recipeDescriptors[
            Math.floor(Math.random() * recipeDescriptors.length)
          ];
        randomQueries.push(randomDescriptor + " " + randomType);
        randomTypes.add(randomType.toLowerCase());
      }
    }

    return { randomQueries, randomTypes: Array.from(randomTypes) };
  }

  // Get unique random indexes for recipes
  function getRandomIndexes(recipes) {
    try {
      let availableNumbers = Array.from(
        { length: recipes.length },
        (_, i) => i
      );
      let randomIntegers = [];

      for (let i = 0; i < NUMBER_OF_RECIPES; i++) {
        let randomIndex = Math.floor(Math.random() * availableNumbers.length);
        randomIntegers.push(availableNumbers[randomIndex]);
        availableNumbers.splice(randomIndex, 1);
      }

      return randomIntegers;
    } catch (error) {
      return null;
    }
  }

  // Get random recipes from random queries
  async function getRandomRecipes(randomQueries, randomTypes) {
    let allRandomRecipes = [];

    try {
      // Create an array of promises for fetching recipes concurrently
      const recipePromises = randomQueries.map((query) =>
        getRecipes(null, query)
      );

      // Wait for all promises to resolve, fetch all recipe calls concurrently
      const results = await Promise.all(recipePromises);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.hits.length > 0) {
          const recipes = result.hits;
          const randomIndexes = getRandomIndexes(recipes);
          let randomRecipes = [];

          for (let j = 0; j < NUMBER_OF_RECIPES; j++) {
            const randomRecipe = recipes[randomIndexes[j]];
            if (randomRecipe === undefined) {
              continue;
            }
            randomRecipes.push(randomRecipe);
          }

          allRandomRecipes[i] = randomRecipes;
        }
      }
    } catch (error) {}

    if (allRandomRecipes.length === 0) {
      setDiscoverText("unable to fetch recipes, refresh to try again!");
      discoverHeading.current.style.marginBottom = "320px";
    } else {
      setDiscoverText("discover new recipes");
      discoverHeading.current.style.marginBottom = "40px";
    }

    setRecipeList(allRandomRecipes);
    setTitleList(randomTypes);
  }

  // Handler for fetching/refreshing recipes
  async function handleRandomRecipes() {
    refreshButton.current.disabled = true;
    setRefreshIcon(faLemon);
    setLoadMoreText("loading...");
    setIsLoading(true);

    const { randomQueries, randomTypes } = generateRandomQueries();
    await getRandomRecipes(randomQueries, randomTypes);

    setIsLoading(false);
    setRefreshIcon(faRotateRight);
    setLoadMoreText("load more");
    refreshButton.current.disabled = false;
  }

  // Load random recipes on load
  useEffect(() => {
    handleRandomRecipes();
  }, []);

  return (
    <div>
      <Header />
      <div className="discover-panel">
        <div className="discover-heading" ref={discoverHeading}>
          <span className="heading-text discover-heading-text">
            <FontAwesomeIcon
              icon={faCompass}
              className="heading-icon"
            ></FontAwesomeIcon>
            {discoverText}
          </span>
          <button
            className="button discover-refresh-button"
            ref={refreshButton}
            onClick={() => {
              handleRandomRecipes();
            }}
          >
            <FontAwesomeIcon
              icon={refreshIcon}
              className={`${isLoading ? "refreshing-icon" : ""}`}
            ></FontAwesomeIcon>
            <span className="refresh-button-text">{loadMoreText}</span>
          </button>
        </div>
        <div className="recipe-pane">
          {recipeList.map((singleRecipeList, index) => (
            <div key={index} className="single-recipe-container">
              <span className="recipe-pane-title">{titleList[index]}</span>
              <div className="single-recipe-pane">
                <RecipePane recipeList={singleRecipeList} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
