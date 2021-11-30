import {setDataManagerSource, initDataManager} from './dataManager.js';


async function start(){
  setDataManagerSource("http://localhost:5501/datas/recipes.json");
  await initDataManager();
}

start();