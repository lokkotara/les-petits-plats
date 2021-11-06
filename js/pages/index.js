import {getAllRecipes} from "../dataManager.js"
let DOM;

export default function injectPage(domTarget) {
  DOM = domTarget;
  showAllRecipes();
  }

  async function showAllRecipes() {
    let content = "";
    try {
      const recipes = await getAllRecipes();
      for (let i = 0; i < recipes.length; i++) {
        content += templateRecipe(recipes[i]);     
      }
    } catch (error) {
      console.error(error);
    }
    DOM.innerHTML = content;
  }

  function templateRecipe(recipe) {
    return /*html*/`
  <article class="recipeCard rounded d-flex flex-column mb-5 overflow-hidden">
    <div class="h-50">
      <img src="https://via.placeholder.com/380.jpg?text=${recipe.name} " alt="Limonade à la noix de coco" class="h-100 w-100">
    </div>
    <div class="d-flex flex-column recipeCardText h-50">
      <div class="d-flex justify-content-between p-2 px-4 align-items-center">
        <span class="recipeCardName">${recipe.name}</span>
        <span class="cardTimeContainer">
          <span class="far fa-clock"></span>
          <span class="recipeCardTime fw-bold">${recipe.time} min</span>
        </span>
      </div>
      <div class="d-flex justify-content-between p-2 px-4 recipeCardContent">
        <ul class="w-50 list-unstyled">
          ${displayIngredients(recipe.ingredients)}
        </ul>
        <span class="w-50 ellipsis">${recipe.description}</span>
      </div>
    </div>
  </article>
    `;
  }

  function displayIngredients(ingredients) {
    let htmlContent = "";
    for (let i = 0; i < ingredients.length; i++) {
      const elt = ingredients[i];
      htmlContent += `
      <li><span class="fw-bold">${elt.ingredient}</span>${elt.quantity  ? ": "+elt.quantity : ""} ${elt.unit ? elt.unit : ""}</li>
      `
    }
    return htmlContent;
  }