import {setDataManagerSource} from './dataManager.js';
import injectPage from './pages/index.js';

setDataManagerSource("http://localhost:5501/datas/recipes.json");
injectPage(document.querySelector(".recipesContainer"));