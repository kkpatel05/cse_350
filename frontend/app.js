import { getRecipes } from "./firebase-config.js";

getRecipes()
  .then(response => {
    const recipes = response.data;
    console.log("Fetched recipes:", recipes);
    // TODO: Dynamically inject recipes into your HTML here
  })
  .catch(error => {
    console.error("Error fetching recipes:", error.message);
  });
