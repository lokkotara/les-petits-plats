let recipes = null;
let src;

function initDataManager(source){
  src = source;
}

async function getAllRecipes() {
  if (recipes !== null) return recipes;
  try {
    const data = await fetch(src);
    recipes = await data.json();
    return recipes;
  } catch (error) {
    console.error(error);
  }
}

export {
  initDataManager,
  getAllRecipes
}