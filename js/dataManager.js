let recipes = null;
let src;

async function getAllRecipes() {
  if (recipes !== null) return recipes;
  try {
    const data = await fetch(src);
    recipes = await data.json();
    // console.log("------");
    // console.log(recipes);
    // console.log("------");
    // recipes = displayRecipes();
    // console.log("--    --");
    // console.log(recipes);
    // console.log("--    --");
    return recipes;
  } catch (error) {
    console.error(error);
  }
}

function initDataManager(source){
  src = source;
}

function displayRecipes() {
  let array = [];
  for (let i = 0; i < recipes.length; i++) {
    const elt = recipes[i];
    array.push(
      new Recipe(
        elt.id,
        elt.name,
        elt.servings,
        elt.ingredients,
        elt.time,
        elt.description,
        elt.appliance,
        elt.ustensils
      )
    );
  }
  console.log(array);
  return array;
}

export {
  initDataManager,
  getAllRecipes,
  // displayRecipes
}