import {initDataManager} from './dataManager.js';
import injectPage from './pages/index.js';

initDataManager("http://localhost:5501/datas/recipes.json");
injectPage(document.querySelector(".recipesContainer"));