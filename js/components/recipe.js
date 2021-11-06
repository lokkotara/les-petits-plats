class Recipe {
  constructor(id, name, servings, ingredients, time, description, appliance, ustensils) {
    this.id = id,
    this.name= name,
    this.servings = servings,
    this.ingredients = ingredients,
    this.time = time,
    this.description = description,
    this.appliance = appliance,
    this.ustensils = ustensils;
  }
  displayIngredients() {
    let htmlContent = "";
    for (let i = 0; i < this.ingredients.length; i++) {
      const elt = this.ingredients[i];
      htmlContent += `
      <li><span class="fw-bold">${elt.ingredient}:</span>${elt.quantity} ${elt.unit ? elt.unit : ""}</li>
      `
    }
    return htmlContent;
  }
}
