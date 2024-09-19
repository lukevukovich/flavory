import RecipeTile from "../RecipeTile/RecipeTile";
import "./RecipePane.css";
import "../../App.css";
import { getRecipeID } from "../../utils/RecipeAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getNextRecipes } from "../../utils/RecipeAPI";
import { useEffect, useRef } from "react";

export default function RecipePane({
  recipeList,
  setRecipeList,
  moreResultsLink,
  setMoreResultsLink,
}) {
  // Ref for load more button
  const loadMoreButton = useRef(null);

  // Load more results when the load more button is clicked
  async function loadMoreResults() {
    const parsedUrl = new URL(moreResultsLink);
    const queryParams = parsedUrl.searchParams;
    const recipeQuery = queryParams.get("q");
    const continueID = queryParams.get("_cont");

    const result = await getNextRecipes(recipeQuery, continueID);
    if (result.hits.length > 0) {
      setRecipeList([...recipeList, ...result.hits]);
    }
    try {
      setMoreResultsLink(result._links.next.href);
    } catch (error) {
      setMoreResultsLink(null);
    }
  }

  // Hide load more button when there are no more results
  useEffect(() => {
    if (moreResultsLink === null) {
      loadMoreButton.current.style.display = "none";
    } else {
      loadMoreButton.current.style.display = "flex";
    }
  }, [moreResultsLink]);

  return (
    <div className="recipe-pane">
      <div className="recipe-pane-container">
        {recipeList.map((recipe) => (
          <RecipeTile key={getRecipeID(recipe)} recipe={recipe} />
        ))}
      </div>
      <button
        className="load-more-button button"
        ref={loadMoreButton}
        onClick={() => {
          loadMoreResults();
        }}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="button-icon"
        ></FontAwesomeIcon>
        load more
      </button>
    </div>
  );
}
