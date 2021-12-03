let recipes = null;
let src;

const activesFilters = {
  appliance: [],
  ustensils: [],
  ingredients: [],
  text: "",
};

// const recipeList = {};
// const ustensilsList = {};
// const ingredientsList = {};
// const applianceList = {};

const ingredientsHashed = {};
const applianceHashed = {};
const ustensilsHashed = {};
let textsHashed = {};

let prevIdRecipes = null;


async function initDataManager() {
  try {
    const response = await fetch(src);
    recipes = await response.json();
    textsHashed = getHashRecipeList();
    debug()
    prevIdRecipes = getAllId()
  } catch (error) {
    console.error(error);
  }
}

function setDataManagerSource(source) {
  src = source;
}

function debug(){
  activesFilters.text = "";
  // console.log(getAllRecipes())
}
// let old;
// function saveText(text) {
//   if(text.length<3) {
//     activesFilters.text = "";
//   } else {
//     activesFilters.text = normalizeWord(text);
//   }
//   old = text;
// }

function getAllId(){
  const ids = [];
  recipes.forEach(element => {
    ids.push(element.id);
  });
  return ids;
}

function filterByText(source){
  console.log(activesFilters.text);
  if (activesFilters.text === "") return source;
  return getIntersectArray(source, textsHashed[activesFilters.text]);
}

function addFilterTag(type, value){
  activesFilters[type].push(value);
}

function removeFilterTag(type, value){
  const index = activesFilters[type].indexOf(value);
  activesFilters[type].splice(index, 1);
  switch (type){
    case "ingredients" : prevIdIngredients = null; break;
  }
}
// function getBasicRecipes() {
//   prevIdRecipes = null;
//   return filterByText(getAllId());
// }

function getAllRecipes() {
  prevIdRecipes =  filterByText(prevIdRecipes);
  // prevIdRecipes = filterByAppliance(prevIdRecipes)
  return  prevIdRecipes;

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
  /*
  si pas de filtres:  return recipes;
  let filteredList = [];
  pour chaque type on récupère le tableau des id de recettes et on croise avec le résultat des précédents que l'on stocke dans filteredList

  on retourne les recettes filtrées (filteredList)
  */
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
  if (arrayA === null) return arrayB;

  const intersect = [...new Set(arrayA)].filter((elt) => [...new Set(arrayB)].includes(elt));
  return intersect;
}

function recipeListFromIdArray(idArray) {
  let result = [];
  idArray.forEach((id) => {
    result.push(recipes[id - 1]);
  });
  return result;
}

// function getRecipeList(array) {
//   let tempArray = [];
//   array.forEach(word => {
//     if(word !== undefined && word.length > 2) {
//       if(recipeList[normalizeWord(word)] !== undefined) {
//         console.log(recipes);
//         recipes = recipeListFromIdArray(recipeList[normalizeWord(word)]);
//         console.log(recipes);
//       } else {
//       console.log("Aucune recette ne correspond à votre crit\ère... Vous pouvez chercher \"tarte aux pommes\", \"poisson\", etc.");
//       }
//     }
//   });
// }

function getHashRecipeList() {
  let words;
  let sentence;
  let wordFragment;
  const list = {};
  recipes.forEach((recipe) => {
    // console.log(recipe.name);
    sentence = recipe.name.toLowerCase();
    words = sentence.split(" ");
    words.forEach((word) => {
      if (word.length < 3) return;
      for (let i = 3, size = word.length; i <= size; i++) {
        wordFragment = normalizeWord(word).slice(0, i);
        if (list[wordFragment] === undefined) list[wordFragment] = [];
        list[wordFragment].push(recipe.id);
      }
    });
  });
  return list;
}

// function getSeparatedWord(string) {
//   let stringArray = string.split(" ");
//   return stringArray;
// }

// function removeTrashWords(array) {
//   return array.filter(word=>word.length>3);
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

// /**
//  * Permet de retourner la liste du filtre sans l'occurence sur laquelle on vient de cliquer
//  *
//  * @param   {[type]}  type  [type description]
//  *
//  * @return  {[type]}        [return description]
//  */
// function getWithoutActivesFilters(type){
//   const list = Object.keys(type+"List");
//   activesFilters[type].forEach(filter => {
//     list.splice(list.indexOf(filter), 1);
//   });
//   return list;
// }

// function getListFromInput(value) {
//   value = normalizeWord(value);
//   console.log(recipeList[value]);
// }

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

// const getUstensilsList = () => {};
// const normalizeWord = () => {};
// // const getAllRecipes = () => {};
// const getRecipeList = () => {};
// const getListFromInput = () => {};

export {
  initDataManager,
  getAllRecipes,
  normalizeWord,
  setDataManagerSource,
  // saveText,
  recipeListFromIdArray,
  filterByText,
  // getBasicRecipes,
  // getUstensilsList,
  // getRecipeList,
  // getListFromInput,
};
