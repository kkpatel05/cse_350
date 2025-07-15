import { getRecipes } from "./firebase-config.js";

getRecipes()
  .then(response => {
    console.log("Recipes:", response.data); // This logs the recipes to the browser console
  })
  .catch(err => {
    console.error("Error fetching recipes:", err);
  });
