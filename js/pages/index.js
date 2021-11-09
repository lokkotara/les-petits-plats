import {getAllRecipes} from "../dataManager.js"
import {displayFilter, toggleFilter} from "../components/filter.js"
let DOM;

export default function injectPage(domTarget) {
  DOM = domTarget;
  showAllRecipes();
  showFilters();
  const containers = document.querySelectorAll(".filterContainer");
  containers.forEach(container => {
    console.log(container);
    container.addEventListener("click", toggleFilter);
  });
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

  function showFilters() {
    const domTarget = document.querySelector('.filterContainerWrapper');
    const filters = [
      {
        name: "Ingredients",
        list: [],
        placeholder: "Rechercher un ingrédient",
        color: "#3282F7"
      }, {
        name: "Appareils",
        list: [],
        placeholder: "Rechercher un appareil",
        color: "#68D9A4"
      }, {
        name: "Ustensiles",
        list: [],
        placeholder: "Rechercher un ustensile",
        color: "#ED6454"
      }
    ];
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      domTarget.innerHTML += displayFilter(filter.name, filter.list, filter.placeholder, filter.color);
      
    }
  }
