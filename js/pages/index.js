import {
  displayFilter,
  displayFiltersList,
  getFilterInput,
  toggleFilter,
} from "../components/filter.js";

import {
  getAllRecipes,
  getAllWords,
  getArrayFromInput,
  getFiltersList,
  getHashIngredients,
  initDataManager,
  instantiateFilters,
  normalizeWord,
  recipeListFromIdArray,
} from "../dataManager.js";

let DOM;

export default async function injectPage(domTarget) {
  DOM = domTarget;
  await initDataManager();
  showAllRecipes();
  addSearchListener();
  showFilters();
  displayFiltersList();
  addFilterListener();
  getFilterInput();
  getHashIngredients();
  // displayTag();
}
function addFilterListener() {
  const containers = document.querySelectorAll(".filterContainer");
  containers.forEach(container => {
    const label = container.firstElementChild.firstElementChild,
      span = label.firstElementChild,
      icon = label.lastElementChild;
    icon.addEventListener("click", toggleFilter.bind(null, span));
  });
}

function addSearchListener() {
  const input = document.getElementById("searchInput");
  input.addEventListener("input",() => {
    getRecipesToDisplay();
    displayFiltersList();
  });
}

function getRecipesToDisplay() {
  const word = getSearchInput();
  if (word !== undefined && word.length>2) {
    const arrayToShow = getArrayFromInput(word);
    showAllRecipes(arrayToShow);
  }
}

function showAllRecipes(recipesIdList) {
  let content = "";
  let recipes = [];
  try {
    if (recipesIdList === undefined) {
      recipes = recipeListFromIdArray(getAllRecipes());
      getFiltersList(getAllRecipes());
    } else {
      getAllRecipes(recipesIdList);
      recipes = recipeListFromIdArray(recipesIdList);
    }
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
      <img src="https://via.placeholder.com/380.jpg?text=${recipe.name} " alt="${recipe.name}" class="h-100 w-100">
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
      `;
  }
  return htmlContent;
}

function showFilters() {
  const domTarget = document.querySelector(".filterContainerWrapper");
  const filters = instantiateFilters();
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    domTarget.innerHTML += displayFilter(filter);
  }
}

function getSearchInput() {
  const ingredient = document.getElementById("searchInput");
  let inputToSearch;
  ingredient.addEventListener("input", (event) => {
    inputToSearch = event.target.value;
    const inputToSearchArray =inputToSearch.split(" ");
    const idArray = getAllWords(inputToSearchArray);
    if (inputToSearchArray[0].length > 2) showAllRecipes(idArray);
  });
}
// function getSearchInput() {
//   const ingredient = document.getElementById("searchInput");
//   return normalizeWord(ingredient.value);
// }