
class DataManager {

  recipes = null;

  constructor(src) {
    this.src = src;
  }

  async getAllRecipes() {
    if(this.recipes !== null) return this.recipes;
    try {
      const data = await fetch(this.src);
      this.recipes = await data.json();
      return this.recipes;
    } catch (error) {
      console.error(error);
    }
    
  }

  displayRecipes() {
    
  }
}