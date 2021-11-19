let recipes = null;
let src;

const activesFilters = {
  "appliance" : null,
  "ustensils" : [],
  "ingredients" : [],
  "text" : ""
}

const recipeList = {};
const ustensilsList = {};
const ingredientsList = {};
const applianceList = {};

const ingredientsHashed = {};
const applianceHashed = {};
const ustensilsHashed = {};
const textsHashed = {};


async function initDataManager() {
  try {
    const response = await fetch(src);
    recipes = await response.json();
    getHashRecipeList();
    getApplianceList();
  } catch (error) {
    console.error(error);
  }
}

function setDataManagerSource(source) {
  src = source;
}

function getAllRecipes() {
  return recipes;
}

function getRecipeList(value) {
  if(recipeList[value] !== undefined) {
    console.log(recipeList[value]);
  } else {
    console.log("Aucune recette ne correspond à votre recherche... Vous pouvez chercher \"tarte aux pommes\", \"poisson\", etc.");
  }
}

function getHashRecipeList() {
  recipes.forEach(recipe => {
    let wordArray = getSeparatedWord(normalizeWord(recipe.name));
    let filteredArray = (removeTrashWords(wordArray));
    // console.log(filteredArray.map(normalizeWord));
    filteredArray.map(normalizeWord).forEach(word => {
      if(!recipeList[normalizeWord(word)]) {
        recipeList[normalizeWord(word)] = [recipe.id];
      } else {
        recipeList[normalizeWord(word)].push(recipe.id);
      }
    })
    // console.log(recipeList);
  })
  return recipeList;
}

function getSeparatedWord(string) {
  let stringArray = string.split(" ");
  return stringArray;
}

function removeTrashWords(array) {
  return array.filter(word=>word.length>3);
}

function getApplianceList() {
  recipes.forEach(recipe => {
    if(!applianceList[normalizeWord(recipe.appliance)]) {
      applianceList[normalizeWord(recipe.appliance)] = [recipe.id];
    } else {
      applianceList[normalizeWord(recipe.appliance)].push(recipe.id);
    }
  })
}

function getUstensilsList(){
  return getWithoutActivesFilters("ustensils");
}

function getWithoutActivesFilters(type){
  const list = Object.keys(type+"List");
  activesFilters[type].forEach(filter => {
    list.splice(list.indexOf(filter), 1);
  });
  return list;
}

function normalizeArrayWord(array) {
  array.forEach(word => normalizeWord(word))
}

function normalizeWord(word) {
  const regex = /\.+/g;
  const lowerCasedWord = word.toLowerCase();
  const normalizedWord = lowerCasedWord
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const sanitizedWord = normalizedWord.replace(regex, "");
  return sanitizedWord[0].toUpperCase() + sanitizedWord.substring(1);
}

export { initDataManager, getAllRecipes, normalizeWord, setDataManagerSource, getUstensilsList, getRecipeList};
