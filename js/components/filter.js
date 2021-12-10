import {normalizeWord, getListFromInput, getFiltersList} from "../dataManager.js"

function displayFilter(filter) {
  return `
  <div class="filterContainer text-light  rounded d-flex align-items-center" style="background-color: ${filter.color};">
    <label id="${filter.id}FilterLabel" for="${filter.id}" class="d-flex flex-column justify-content-between container position-relative">
      <div class="d-flex justify-content-between align-items-center position-relative">
        <span  id="${filter.id}FilterSpan" class="filterSpan">${filter.name}</span>
        <input type="text" id="${filter.id}" placeholder="${filter.placeholder}" class="hidden filterInput"/>
        <i class="fas fa-chevron-down filterChevron" id="${filter.id}-filter-icon"></i>
      </div>
      <div id="${filter.id}FilterListContainer"class="px-3 ms-0 hidden overflow-hidden position-absolute top-100"  style="background-color: ${filter.color};left:0;">
        <ul class="${filter.id}FilterList list-unstyled d-flex flex-wrap mt-2" id="${filter.id}FilterList">
        </ul>
      </div>
    </label>
  </div>
  `;
}

function toggleFilter(elt) {
  let span = elt,
      div = elt.parentNode,
      label = div.parentNode,
      icon = div.lastElementChild,
      list = label.lastElementChild,
      input = span.nextElementSibling;

  label.parentNode.classList.toggle('open');
  span.classList.toggle('hidden');
  input.classList.toggle('hidden');
  list.classList.toggle('hidden');
  icon.classList.toggle('fa-chevron-down');
  icon.classList.toggle('fa-chevron-up');
}

function displayFiltersList(recipesList) {
  let recipes = getFiltersList();
  const ingredientListContainer = document.getElementById('ingredientFilterList'),
        applianceListContainer = document.getElementById('applianceFilterList'),
        ustensilListContainer = document.getElementById('ustensilFilterList');
  let ingredientList = [],
      applianceList = [],
      ustensilList = [];

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      ingredientList.push(normalizeWord(ingredient.ingredient));
    })

    applianceList.push(normalizeWord(recipe.appliance));

    recipe.ustensils.forEach(ustensil => {
      let id = recipe.id;
        ustensilList.push(normalizeWord(ustensil));
    })
  })
  const ingredientSortedList = [...new Set(ingredientList)].sort(),
        applianceSortedList = [...new Set(applianceList)].sort(),
        ustensilSortedList = [...new Set(ustensilList)].sort();
  ingredientListContainer.innerHTML = templateFilterList(ingredientSortedList);
  applianceListContainer.innerHTML = templateFilterList(applianceSortedList);
  ustensilListContainer.innerHTML = templateFilterList(ustensilSortedList);
}

function templateFilterList(list) {
  let htmlContent = "";
  for (let i = 0; i < list.length; i++) {
    const elt = list[i];
    htmlContent += `
    <li class="filterListItem"><span class="pe-3 itemSpan">${elt}</li>
    `
  }
  return htmlContent;
}

function getFilterInput() {
  let ingredient = document.getElementById('ingredient');
  let inputToSearch;
  ingredient.addEventListener('input', (event) => {
    inputToSearch = event.target.value;
    if(inputToSearch.length > 2) {
      getListFromInput(inputToSearch);
    }
  })
}

function displayTag() {
  let container = document.querySelector('.filterTagContainer');
  const test = {
    name: "Coco",
    color: "#3282F7"
  };
  const tagToDisplay = templateTag(test['name'], test['color']);
  container.innerHTML += tagToDisplay;
}

/**
 * Retourne le template  du tag sélectionné
 *
 * @param   {string}  name   Le nom correspondant au tag choisi
 * @param   {string}  color  La couleur correspondant à la liste de filtre à laquelle appartient le tag
 *
 * @return  {HTMLElement}         Retourne le tag
 */
function templateTag(name, color) {
  const template = `
    <span class="filterTag btn text-light" style="background-color: ${color}">
      <span class="lh-1">${name}</span>
      <span class="far fa-times-circle align-middle filterTagIcon lh-1"></span>
    </span>
  `;
return template
}

export {
  displayFilter,
  displayFiltersList,
  toggleFilter,
  getFilterInput,
  displayTag
}