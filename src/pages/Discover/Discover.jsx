import "./Discover.css";
import Header from "../../assets/Header/Header";
import Footer from "../../assets/Footer/Footer";
import { useEffect } from "react";
import { recipeTypes, recipeDescriptors } from "../../utils/RecipeData";
import { useState } from "react";
import { getRecipes } from "../../utils/RecipeAPI";
import RecipeTile from "../../assets/RecipeTile/RecipeTile";

export default function Discover() {
  const NUMBER_OF_QUERIES = 4;
  const NUMBER_OF_RECIPES = 4;

  const [titleList, setTitleList] = useState([]);

  const [recipeList, setRecipeList] = useState(
    Array(NUMBER_OF_QUERIES).fill([])
  );

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

    setRecipeList(allRandomRecipes);
    console.log(randomQueries);
    setTitleList(randomTypes);
  }

  useEffect(() => {
    const { randomQueries, randomTypes } = generateRandomQueries();
    getRandomRecipes(randomQueries, randomTypes);
  }, []);

  return (
    <div>
      <Header />
      <div className="discover-panel">
        <div className="recipe-pane">
          {recipeList.map((singleRecipeList, index) => (
            <div key={index} className="single-recipe-container">
              <span className="recipe-pane-title">{titleList[index]}</span>
              <div className="single-recipe-pane">
                {singleRecipeList.map((recipe, tile_index) => (
                  <RecipeTile key={tile_index} recipe={recipe} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
