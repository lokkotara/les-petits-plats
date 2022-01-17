let recipes = null;
let src;

const filters = [
  {
    color         : "#3282F7",
    id            : "ingredients",
    name          : "Ingredients",
    placeholder   : "Rechercher un ingrédient",
  }, {
    color         : "#68D9A4",
    id            : "appliance",
    name          : "Appareils",
    placeholder   : "Rechercher un appareil",
  }, {
    color         : "#ED6454",
    id            : "ustensils",
    name          : "Ustensiles",
    placeholder   : "Rechercher un ustensil",
  }
];
let filterArray = [];
const activesFilters = {
  appliance     : [],
  ingredients   : [],
  text          : "",
  ustensils     : [],
};

const ingredientList = [],
  applianceList = [],
  ustensilList = [];

const applianceHashed   = {};
const ustensilsHashed   = {};
let ingredientsHashed   = {};
let prevIdRecipes       = null;
let textsHashed         = {};

/**
 *Initialise le gestionnaire de données.
 * => Fait la requête à l'API
 * => Récupère la réponse
 */
async function initDataManager() {
  try {
    const response    = await fetch(src);
    recipes           = await response.json();
    textsHashed       = getHashRecipeList();
    prevIdRecipes     = getAllId();
  } catch (error) {
    console.error(error);
  }
}

function getFiltersList() {
  console.log(prevIdRecipes);
  return recipeListFromIdArray(prevIdRecipes);
}

function getActiveFilter(type) {
  return activesFilters[type];
}

function getActiveIngredient() {
  return getActiveFilter("ingredient");
}

function getActiveAppliance() {
  return getActiveFilter("appliance");
}

function setDataManagerSource(source) {
  src = source;
}

/**
 *Permet de récupérer les données au niveau du dataManager pour créer les filtres.
 *
 * @return {Array} Un array d'objets qui ont pour attributs color, id, name, placeholder
 */
function instantiateFilters() {
  return filters;
}

/**
 *Renvoie un array contenant tous les ids des recettes
 *
 * @return {Array} Un array de number avec l'id de toutes les recettes
 */
function getAllId(){
  const ids = [];
  recipes.forEach(element => {
    ids.push(element.id);
  });
  return ids;
}
/**
 *Compare le texte présent dans le filtre actif et retourne 
 *
 * @param {Array} source
 * @return {Array} Le tableau contenant uniquement les ids similaires entre la source et le texte du filtre actif
 */
function filterByText(source){
  if (activesFilters.text === "") return source;
  return getIntersectArray(source, textsHashed[activesFilters.text]);
}

function filterByIngredient(source){
  // s'il n'y a pas de tag sélectionné dans activesFilter.ingredients, on retourne prevIdRecipe
  //
  // On renvoie un array d'ids des recettes correspondantes
  if (activesFilters.ingredients.length < 1) return source;

}

function getIngredientsList() {
  const recipes = recipeListFromIdArray(prevIdRecipes);
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientList.push(normalizeWord(ingredient.ingredient));
    });
  });
  const ingredientSortedList = [...new Set(ingredientList)].sort();
  return ingredientSortedList;
}

function getApplianceList() {
  const recipes = recipeListFromIdArray(prevIdRecipes);
  recipes.forEach((recipe) => {
    applianceList.push(normalizeWord(recipe.appliance));
  });
  const applianceSortedList = [...new Set(applianceList)].sort();
  return applianceSortedList;
}

function getUstensilsList() {
  const recipes = recipeListFromIdArray(prevIdRecipes);
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilList.push(normalizeWord(ustensil));
    });
  });
  const ustensilsSortedList = [...new Set(ustensilList)].sort();
  return ustensilsSortedList;
}

function saveAllFilters(array) {
  filterArray = array;
}

function closeAllExceptSelected(id) {
  filterArray.forEach(filter => {
    if (filter.id === id) {
      filter.toggleFilter();
    } else {
      filter.closeFilter();
    }
  });
}

function returnFilterArray() {
  return filterArray;
}

function getColorFromId(id) {
  let color = "";
  filters.forEach(filter => {
    if (filter.id === id) {
      color = filter.color;
    }
  });
  return color;
}

function addFilterTag(type, value){
  activesFilters[type].push(value);
  console.log(activesFilters[type]);
}

function removeFilterTag(type, value){
  const index = activesFilters[type].indexOf(value);
  activesFilters[type].splice(index, 1);
}

function getAllRecipes() {
  prevIdRecipes =  filterByText(prevIdRecipes);
  // prevIdRecipes = filterByUstensil(prevIdRecipes)
  // prevIdRecipes = filterByIngredient(prevIdRecipes)
  // prevIdRecipes = filterByAppliance(prevIdRecipes)
  return  prevIdRecipes;
}

/**
 * Prend en paramètre 2 tableaux d'id et retourne un tableau avec uniquement les valeurs communes aux 2 tableaux
 *
 * @param   {Array}  arrayA  [arrayA description]
 * @param   {Array}  arrayB  [arrayB description]
 *
 * @return  {Array}            retourne l'intersection des deux tableaux
 */
function getIntersectArray(arrayA, arrayB){
  if (arrayA.length === 0) return arrayB;

  const intersect = [...new Set(arrayA)].filter((elt) => [...new Set(arrayB)].includes(elt));
  return intersect;
}

function recipeListFromIdArray(idArray) {
  const result = [];
  idArray.forEach((id) => {
    result.push(recipes[id - 1]);
  });
  return result;
}

function getArrayFromInput(word) {
  activesFilters.text = word;
  return textsHashed[activesFilters.text];
}

function getListFromInput(value) {
  value = normalizeWord(value);
  const array = getArrayFromInput(value);
  return array;
}

function getHashIngredientList(recipe, list) {
  let sentence, wordFragment, words;
  const ingredientsArray= recipe.ingredients;
  ingredientsArray.forEach(ingredient => {
    sentence =ingredient.ingredient.toLowerCase();
    words = sentence.split(" ");
    words.forEach((word) => {
      word = cleanWord(word);
      if (word.length < 3) return;
      for (let i = 3, size = word.length; i <= size; i++) {
        wordFragment = normalizeWord(word).slice(0, i);
        if (list[wordFragment] === undefined) list[wordFragment] = [];
        if (!list[wordFragment].includes(recipe.id)) list[wordFragment].push(recipe.id);
      }
    });
  });
  return list;
}

/**
 *Hash les mots renseignés en paramètre et les ajoute à la liste principale.
 *
 * @param {Object} recipe l'objet recette avec comme attribut id, name, servings, ingredients, time, appliance, ustensils, description.
 * @param {Object} list La liste principale à peupler
 * @param {String} attribute Permet de sélectionner l'attribut de l'objet recipe sur lequel on veut établir le hashage.
 * @return {Object} Retourne la liste de hash intermédiaire
 */
function getHashSubList(recipe, list, attribute) {
  let wordFragment;
  const sentence    = recipe[attribute].toLowerCase(),
    words           = sentence.split(" ");
  words.forEach((word) => {
    word = cleanWord(word);
    if (word.length < 3) return;
    for (let i = 3, size = word.length; i <= size; i++) {
      wordFragment = normalizeWord(word).slice(0, i);
      if (list[wordFragment] === undefined) list[wordFragment] = [];
      if (!list[wordFragment].includes(recipe.id)) list[wordFragment].push(recipe.id);
    }
  });
  return list;
}

/**
 *Récupère les tables de hash intermédiaires et retourne une table de hash principale
 *
 * @return {Object} Un objet avec pour clé chaque incrémentation des mots à hasher, et pour valeur un array des ids de recettes correspondantes
 */
function getHashRecipeList() {
  let list = {};
  recipes.forEach((recipe) => {
    list = getHashIngredientList(recipe, list);
    list = getHashSubList(recipe, list, "name");
    list = getHashSubList(recipe, list, "description");
  });
  return list;
}

function getHashIngredients() {
  let list;
  recipes.forEach(recipe => {
    list = getHashIngredientList(recipe, ingredientsHashed);
  });
  return list;
}

/**
 *Nettoie le mot passé en paramètre
 *
 * @param {String} word Un mot dont on ne maitrîse pas le format (accent, symbole)
 * @return {String} Retourne le mot sans ponctuation, sans chiffre et sans symbole
 */
function cleanWord(word) {
  const regexp = /[/,;().!0-9%:]/g;
  return word.replace(regexp, "");
}

/**
 * [getAllWords description]
 *
 * @param   {String | Array.<String>}  words  [words description]
 *
 * @return  {Array.<Number>}        [return description]
 */
function getAllWords(words){
  ingredientsHashed = getHashIngredients();
  if (typeof words === "string") {
    return ingredientsHashed[normalizeWord(words)];
  }
  let res = [];
  words.forEach( word => {
    if (word.length>2) {
      res = getIntersectArray(res, ingredientsHashed[normalizeWord(word)]);
    }
  });
  return res;
}

/**
 *Permet de retourner un mot toujours au même format
 *
 * @param {String} word Un mot "brut" dont on ne maîtrise pas le format (majuscule, minuscule, accent)
 * @return {String} Un mot "nettoyé" avec une majuscule au début puis des minuscules sans accent
 */
function normalizeWord(word) {
  if (word.length>0) {
    const regex = /\.+/g;
    const lowerCasedWord = word.toLowerCase();
    const normalizedWord = lowerCasedWord
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const sanitizedWord = normalizedWord.replace(regex, "");
    return sanitizedWord[0].toUpperCase() + sanitizedWord.substring(1);
  }
}

// if(activesFilters['appliance'].length<1 && activesFilters['ustensils'].length<1 && activesFilters['ingredients'].length<1) {
//   return recipes;
// }
// console.log("il y a un filtre");
// let filteredList = [];
// if(activesFilters['appliance'].length>0) {
//   filteredList.filter(value => activesFilters['appliance'].includes(value));
//   console.log(filteredList);
// }
// if(activesFilters['ustensils'].length>0) {
//   filteredList.filter(value => activesFilters['ustensils'].includes(value));
//   console.log(filteredList);
// }
// if(activesFilters['ingredients'].length>0) {

//   filteredList.filter(value => activesFilters['ingredients'].includes(value));
// }

// function getSeparatedWord(string) {
//   let stringArray = string.split(" ");
//   return stringArray;
// }

// function removeTrashWords(array) {
//   return array.filter(word=>word.length>2);
// }

// function getApplianceList() {
//   recipes.forEach(recipe => {
//     if(!applianceList[normalizeWord(recipe.appliance)]) {
//       applianceList[normalizeWord(recipe.appliance)] = [recipe.id];
//     } else {
//       applianceList[normalizeWord(recipe.appliance)].push(recipe.id);
//     }
//   })
// }

// function getUstensilsList(){
//   return getWithoutActivesFilters("ustensils");
// }

function getIngredientList(){
  return getWithoutActivesFilters("ingredients");
}

/**
 * Permet de retourner la liste du filtre sans l'occurence sur laquelle on vient de cliquer
 *
 * @param   {[type]}  type  [type description]
 *
 * @return  {[type]}        [return description]
 */
function getWithoutActivesFilters(type){
  // const list = Object.keys(type+"List");
  console.log(activesFilters[type]);
  // activesFilters[type].forEach(filter => {
  //   list.splice(list.indexOf(filter), 1);
  // });
  // return list;
}

// function getRecipeList(array) {
//   const tempArray = [];
//   array.forEach(word => {
//     if (word !== undefined && word.length > 2) {
//       if (recipeList[normalizeWord(word)] !== undefined) {
//         console.log(recipes);
//         recipes = recipeListFromIdArray(recipeList[normalizeWord(word)]);
//         console.log(recipes);
//       } else {
//         console.log("Aucune recette ne correspond à votre critère... Vous pouvez chercher \"tarte aux pommes\", \"poisson\", etc.");
//       }
//     }
//   });
// }

export {
  // getRecipeList,
  // getUstensilsList,
  addFilterTag,
  closeAllExceptSelected,
  filterByText,
  getActiveFilter,
  getActiveAppliance,
  getActiveIngredient,
  getAllRecipes,
  getAllWords,
  getApplianceList,
  getArrayFromInput,
  getColorFromId,
  getFiltersList,
  getHashIngredients,
  getIngredientList,
  getIngredientsList,
  getListFromInput,
  getUstensilsList,
  initDataManager,
  instantiateFilters,
  normalizeWord,
  recipeListFromIdArray,
  returnFilterArray,
  removeFilterTag,
  saveAllFilters,
  setDataManagerSource,
};
