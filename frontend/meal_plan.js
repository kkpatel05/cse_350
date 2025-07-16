import { getRecipes } from "./firebase-config.js";

const restrictionSelect = document.getElementById("restrictionSelect");
const mealPlanContainer = document.querySelector(".meal-plan .meal-columns");

function renderRecipes(recipes) {
  mealPlanContainer.innerHTML = ""; // Clear old content
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <h3>${recipe.title || "Untitled Recipe"}</h3>
      <p>${recipe.description || ""}</p>
      <ul>${(recipe.ingredients || []).map(i => `<li>${i}</li>`).join("")}</ul>
    `;
    mealPlanContainer.appendChild(card);
  });
}

function fetchAndRenderRecipes(restriction = "") {
  getRecipes({ restriction })
    .then(res => renderRecipes(res.data.recipes))
    .catch(err => console.error("Failed to fetch recipes:", err));
}

// Initial load
fetchAndRenderRecipes();

// Update on dropdown change
restrictionSelect.addEventListener("change", (e) => {
  fetchAndRenderRecipes(e.target.value);
});
