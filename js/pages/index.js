class Index {
  constructor(domTarget) {
    this.showAllRecipes(domTarget);
  }

  async showAllRecipes(domTarget) {
    let content = "";
    try {
      const recipes = await app.dataManager.getAllRecipes();
      for (let i = 0; i < recipes.length; i++) {
        content += this.templateRecipe(recipes[i]);     
      }
    } catch (error) {
      console.error(error);
    }
    domTarget.innerHTML = content;
  }

  templateRecipe(recipe) {
    return /*html*/`
      <article class="recipeCard">
        <p>${recipe.name}</p>
      </article>
    `;
  }
}