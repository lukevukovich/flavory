import RecipePane from "../RecipePane/RecipePane";
import "./RecipeResults.css";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getNextRecipes } from "../../utils/RecipeAPI";
import { useEffect, useRef, useState } from "react";
import "../SearchBar/SearchBar.css";
import { faLemon, faPlus } from "@fortawesome/free-solid-svg-icons";

// Recipe results component
export default function RecipeResults({
  recipeList,
  setRecipeList,
  moreResultsLink,
  setMoreResultsLink,
  savedRecipeList,
  setSavedRecipeList,
  setSearchCount,
}) {
  // load more button ref
  const loadMoreButton = useRef(null);

  // States for load more button
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreText, setLoadMoreText] = useState("load more");
  const [loadMoreIcon, setLoadMoreIcon] = useState(faPlus);

  // Load more results when the load more button is clicked
  async function loadMoreResults() {
    const parsedUrl = new URL(moreResultsLink);
    const queryParams = parsedUrl.searchParams;
    const recipeQuery = queryParams.get("q");
    const continueID = queryParams.get("_cont");

    setIsLoading(true);

    const result = await getNextRecipes(recipeQuery, continueID);
    if (result.hits.length > 0) {
      setRecipeList([...recipeList, ...result.hits]);
    }
    try {
      setMoreResultsLink(result._links.next.href);
    } catch (error) {
      setMoreResultsLink(null);
    }

    setIsLoading(false);
  }

  // Set load more button text and icon based on loading state
  useEffect(() => {
    if (isLoading) {
      loadMoreButton.current.disabled = true;
      setLoadMoreIcon(faLemon);
      setLoadMoreText("loading");
    } else {
      loadMoreButton.current.disabled = false;
      setLoadMoreIcon(faPlus);
      setLoadMoreText("load more");
    }
  }, [isLoading]);

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
      <RecipePane
        recipeList={recipeList}
        setRecipeList={setRecipeList}
        savedRecipeList={savedRecipeList}
        setSavedRecipeList={setSavedRecipeList}
        setSearchCount={setSearchCount}
      ></RecipePane>
      <button
        className="load-more-button button"
        ref={loadMoreButton}
        onClick={() => {
          loadMoreResults();
        }}
      >
        <FontAwesomeIcon
          icon={loadMoreIcon}
          className={`button-icon ${isLoading ? "loading-icon" : ""}`}
        ></FontAwesomeIcon>
        {loadMoreText}
      </button>
    </div>
  );
}
