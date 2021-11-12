let recipes = null;
let src;

const activesFilters = {
  "appliance" : null,
  "ustensils" : [],
  "ingredients" : [],
  "text" : ""
}

const ustensilsList = {};
const ingredientsList = {};
const applianceList = {};

const ingredientsHased = {};
const applianceHased = {};
const ustensilsHashed = {};
const textsHashed = {};


async function initDataManager() {
  try {
    const response = await fetch(src);
    recipes = await response.json();
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

function normalizeWord(word) {
  const regex = /\.+/g;
  const lowerCasedWord = word.toLowerCase();
  const normalizedWord = lowerCasedWord
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const sanitizedWord = normalizedWord.replace(regex, "");
  return sanitizedWord[0].toUpperCase() + sanitizedWord.substring(1);
  // return sanitizedWord.split(' ');
}

export { initDataManager, getAllRecipes, normalizeWord, setDataManagerSource, getUstensilsList};
