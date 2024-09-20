import "./Discover.css";
import "../../App.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import { useEffect, useRef } from "react";
import { recipeTypes, recipeDescriptors } from "../../utils/RecipeData";
import { useState } from "react";
import { getRecipes } from "../../utils/RecipeAPI";
import RecipePane from "../../assets/RecipePane/RecipePane";
import { faRotateRight, faLemon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Discover() {
  // Controllers for random recipes
  const NUMBER_OF_QUERIES = 4;
  const NUMBER_OF_RECIPES = 4;

  // States for recipe list
  const [titleList, setTitleList] = useState([]);
  const [recipeList, setRecipeList] = useState(
    Array(NUMBER_OF_QUERIES).fill([])
  );

  // States for refreshing recipes
  const refreshButton = useRef(null);
  const discoverHeading = useRef(null);
  const [discoverText, setDiscoverText] = useState("discover new recipes!");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(faRotateRight);

  // Generate random queries from recipe data
  function generateRandomQueries() {
    let randomQueries = [];
    let randomTypes = [];
    for (let i = 0; i < NUMBER_OF_QUERIES; i++) {
      let randomType =
        recipeTypes[Math.floor(Math.random() * recipeTypes.length)];
      let randomDescriptor =
        recipeDescriptors[Math.floor(Math.random() * recipeDescriptors.length)];
      randomQueries.push(randomDescriptor + " " + randomType);
      randomTypes.push(randomType.toLowerCase());
    }
    return { randomQueries, randomTypes };
  }

  // Get random indexes for recipes, no duplicates
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

    for (let i = 0; i < NUMBER_OF_QUERIES; i++) {
      try {
        const result = await getRecipes(randomQueries[i]);
        if (result.hits.length > 0) {
          const recipes = result.hits;
          const randomIndexes = getRandomIndexes(recipes);
          let randomRecipes = [];

          for (let j = 0; j < NUMBER_OF_RECIPES; j++) {
            const randomRecipe = recipes[randomIndexes[j]];
            if (randomRecipe === undefined) {
              continue;
            }
            randomRecipes.push(recipes[randomIndexes[j]]);
          }

          allRandomRecipes[i] = randomRecipes;
        }
      } catch (error) {
        continue;
      }
    }

    if (allRandomRecipes.length === 0) {
      setDiscoverText("unable to fetch recipes, refresh to try again!");
      discoverHeading.current.style.marginBottom = "338px";
    } else {
      setDiscoverText("discover new recipes!");
      discoverHeading.current.style.marginBottom = "50px";
    }

    setRecipeList(allRandomRecipes);
    setTitleList(randomTypes);
  }

  // Handler for fetching/refreshing recipes
  async function handleRandomRecipes() {
    refreshButton.current.disabled = true;
    setRefreshIcon(faLemon);
    setDiscoverText("fetching recipes...");
    setIsLoading(true);

    const { randomQueries, randomTypes } = generateRandomQueries();
    await getRandomRecipes(randomQueries, randomTypes);

    setIsLoading(false);
    setRefreshIcon(faRotateRight);
    refreshButton.current.disabled = false;
  }

  useEffect(() => {
    handleRandomRecipes();
  }, []);

  return (
    <div>
      <Header />
      <div className="discover-panel">
        <div className="discover-heading" ref={discoverHeading}>
          <span className="discover-heading-text">{discoverText}</span>
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
