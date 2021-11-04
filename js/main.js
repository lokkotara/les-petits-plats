const app = {
  dataManager: new DataManager("http://localhost:5500/datas/recipes.json")
};
app.page = definePage();

function definePage() {
  let url = window.location.pathname;
  if(url === "/" || url === "/index.html") {
    return new Index(document.querySelector("div.recipesContainer"));
  }
};