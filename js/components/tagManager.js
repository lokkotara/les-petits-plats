import {
  getActiveAppliance,
  getActiveIngredient,
  getActiveUstensil,
  updateActiveTag
} from "../../../dataManager.js";

import {exposeMethods} from "../tools.js";
import {updateMain}  from "./main.js";
let DOM;

function updateTagManager(){
  let html = "";
  getActiveIngredient.forEach((ingredient) => {
    html+= templateTag(ingredient, "ingredient");
  });
  getActiveAppliance.forEach((appliance) => {
    html+= templateTag(appliance, "appliance");
  });
  DOM.innerHTML = html;
}

function templateTag(name, type){
  return `
    <button onclick="removeTag('${name}', '${type}')" class="${type}">${name}</button>
  `;
}

function createTagManager(){
  DOM  = document.createElement("tagManager");
  document.body.appendChild(DOM);
  updateTagManager();
  exposeMethods({
    "removeTag": removeTag.bind(this)
  });
}

function removeTag(name, type){
  updateActiveTag(name, type, false);
  updateTagManager();
  updateMain();
}

export {
  createTagManager,
  updateTagManager
};