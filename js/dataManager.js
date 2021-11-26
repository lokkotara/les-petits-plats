let recipes = null;
let src;

const activesFilters = {
  "appliance" : [],
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
  if(activesFilters['appliance'].length<1 && activesFilters['ustensils'].length<1 && activesFilters['ingredients'].length<1) {
    console.log(recipes);
    let filtered = new Set(recipes);
    console.log(recipes[0]);
    console.log(filtered.has(recipes[0]));
    console.log(recipeList);
    return recipes;
  }
  console.log("il y a un filtre");
  let filteredList = [];
  if(activesFilters['appliance'].length>0) {
    filteredList.filter(value => activesFilters['appliance'].includes(value));
    console.log(filteredList);
  }
  if(activesFilters['ustensils'].length>0) {
    filteredList.filter(value => activesFilters['ustensils'].includes(value));
    console.log(filteredList);
  }
  if(activesFilters['ingredients'].length>0) {
    
    filteredList.filter(value => activesFilters['ingredients'].includes(value));
  }
  /*
  si pas de filtres:  return recipes;
  let filteredList = [];
  pour chaque type on récupère le tableau des id de recettes et on croise avec le résultat des précédents que l'on stocke dans filteredList 
  
  
  
  on retourne les recettes filtrées (filteredList)
  */
}

/**
 * [croiseDonnees description]
 *
 * @param   {Array}  tableauA  [tableauA description]
 * @param   {Array}  tableauB  [tableauB description]
 *
 * @return  {Array}            retourne l'intersection des deux tableaux
 */
function croiseDonnees(tableauA, tableauB){
  // on retourne l'intersection des deux tableau
  // on peut utiliser filter et includes
}

function getRecipeList(array) {
  let tempArray = [];
  array.forEach(word => {
    if(word !== undefined && word.length > 2) {
      if(recipeList[normalizeWord(word)] !== undefined) {
        console.log(recipeList[normalizeWord(word)]);
        tempArray.push(recipeList[normalizeWord(word)]);
      } else {
      console.log("Aucune recette ne correspond à votre crit\ère... Vous pouvez chercher \"tarte aux pommes\", \"poisson\", etc.");
      }
    }
  });
  console.log(tempArray);
}

function getHashRecipeList() {
  recipes.forEach(recipe => {
    let wordArray = getSeparatedWord(normalizeWord(recipe.name));
    let filteredArray = (removeTrashWords(wordArray));
    filteredArray.map(normalizeWord).forEach(word => {
      if(!recipeList[normalizeWord(word)]) {
        recipeList[normalizeWord(word)] = [recipe.id];
      } else {
        recipeList[normalizeWord(word)].push(recipe.id);
      }
    })
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
  console.log(applianceList);
}

function getUstensilsList(){
  return getWithoutActivesFilters("ustensils");
}

/**
 * Permet de retourner la liste du filtre sans l'occurence sur laquelle on vient de cliquer
 *
 * @param   {[type]}  type  [type description]
 *
 * @return  {[type]}        [return description]
 */
function getWithoutActivesFilters(type){
  const list = Object.keys(type+"List");
  activesFilters[type].forEach(filter => {
    list.splice(list.indexOf(filter), 1);
  });
  return list;
}

function getListFromInput(value) {
  value = normalizeWord(value);
  console.log(recipeList[value]);
}

function normalizeWord(word) {
  if(word.length>1) {
    const regex = /\.+/g;
  const lowerCasedWord = word.toLowerCase();
  const normalizedWord = lowerCasedWord
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const sanitizedWord = normalizedWord.replace(regex, "");
  return sanitizedWord[0].toUpperCase() + sanitizedWord.substring(1);
  }
}

export { initDataManager, getAllRecipes, normalizeWord, setDataManagerSource, getUstensilsList, getRecipeList, getListFromInput};
