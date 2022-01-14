import {
  addFilterTag,
  closeAllExceptSelected,
  getActiveFilter,
  getAllWords,
  getApplianceList,
  getColorFromId,
  getFiltersList,
  getIngredientList,
  getIngredientsList,
  getListFromInput,
  getUstensilsList,
  normalizeWord,
  recipeListFromIdArray,
  removeFilterTag,
  returnFilterArray
} from "../dataManager.js";

import { exposeMethods } from "../tools.js";

export default class Filter {
  id;

  name;

  placeholder;

  color;

  $dropdown;

  $list;

  opened = false;

  constructor(domTarget, filter) {
    for (const [key, value] of Object.entries(filter)) {
      this[key] = value;
    }
    exposeMethods({
      deleteElement: this.deleteTag.bind(this),
      selectElement: this.selectTag.bind(this),
    });
    this.initDom(domTarget);
    this.renderFilter();
  }

  initDom(domTarget) {
    this.DOM = document.createElement("div");
    this.DOM.className =
      "filterContainer text-light  rounded d-flex align-items-center";
    this.DOM.style.background = this.color;
    domTarget.appendChild(this.DOM);
    this.$dropdown = document.createElement("label");
    this.$dropdown.htmlFor = this.id;
    this.$dropdown.id = this.id + "FilterLabel";
    this.$dropdown.className =
      "d-flex flex-column justify-content-between container position-relative";
    // this.$dropdown.onclick = this.closeAll.bind(this);
    this.DOM.appendChild(this.$dropdown);
  }

  watchChevron() {
    const name = this.id+"-filter-icon";
    const chevron = document.getElementById(name);
    chevron.addEventListener("click",this.closeAll.bind(this));
  }

  dropdowntemplateOpened() {
    this.$dropdown.innerHTML = `
    <div class="d-flex justify-content-between align-items-center position-relative">
        <input type="text" id="${this.id}s" placeholder="${this.placeholder}" class="filterInput"/>
        <i class="fas fa-chevron-up filterChevron" id="${this.id}-filter-icon"></i>
    </div>
    <div id="${this.id}FilterListContainer"class="px-3 ms-0 overflow-hidden position-absolute top-100"  style="background-color: ${this.color};left:0;">
        <ul class="${this.id}FilterList list-unstyled d-flex flex-wrap mt-2" id="${this.id}FilterList">
        </ul>
    </div>
    `;
  }

  dropdowntemplateClosed() {
    this.$dropdown.innerHTML = `
    <div class="d-flex justify-content-between align-items-center position-relative">
        <span  id="${this.id}FilterSpan" class="filterSpan">${this.name}</span>
        <i class="fas fa-chevron-down filterChevron" id="${this.id}-filter-icon"></i>
      </div>
      <div id="${this.id}FilterListContainer"class="hidden px-3 ms-0 overflow-hidden position-absolute top-100"  style="background-color: ${this.color};left:0;">
        <ul class="${this.id}FilterList list-unstyled d-flex flex-wrap mt-2" id="${this.id}FilterList">
        </ul>
    </div>
    `;
  }

  /**
   * [templateFilterList description]
   *
   * @param   {Array}  list  [list description]
   * @param   {( "ingredients" | "ustensils" | "appliance")}  type  [type description]
   *
   * @return  {String}        [return description]
   */
  templateFilterList(list, type) {
    let htmlContent = "";
    for (let i = 0; i < list.length; i++) {
      const elt = list[i];
      htmlContent += /*html*/ `
      <li class="filterListItem" onclick="selectElement('${elt}','${type}')"><span class="pe-3 itemSpan" name="${elt}">${elt}</span></li>
      `;
    }
    return htmlContent;
  }

  renderFilter() {
    if (this.opened) {
      this.dropdowntemplateOpened();
      this.updateList(this.id);
      this.watchChevron();
      return;
    }
    this.dropdowntemplateClosed();
    this.watchChevron();
  }

  getStatus() {
    return this.opened;
  }

  closeFilter() {
    this.opened = false;
    this.DOM.classList.remove("open");
    this.renderFilter();
  }

  closeAll() {
    closeAllExceptSelected(this.id);
  }

  closeAllFilters(id) {
    if (this.id !== id) {
      this.opened = false;
      this.DOM.classList.remove("open");
      this.renderFilter();
    } else {
      this.toggleFilter();
    }
  }

  toggleFilter() {
    this.opened = !this.opened;
    this.DOM.classList.toggle("open");
    this.renderFilter();
  }

  updateList(type) {
    const filterName = this.id + "FilterList";
    this.$list = document.getElementById(filterName);
    let newList;
    switch (type) {
      case "ingredients":
        newList = getIngredientsList();
        this.$list.innerHTML = this.templateFilterList(newList, this.id);
        break;
      case "appliance":
        newList = getApplianceList();
        this.$list.innerHTML = this.templateFilterList(newList, this.id);
        break;
      case "ustensils":
        newList = getUstensilsList();
        this.$list.innerHTML = this.templateFilterList(newList, this.id);
        break;
      default:
        console.error("Houston, on a un problème.");
        break;
    }
  }

  // function getFilterInput() {
  //   const ingredient = document.getElementById("ingredients");
  //   let inputToSearch;
  //   ingredient.addEventListener("input", (event) => {
  //     inputToSearch = event.target.value;
  //     const inputToSearchArray = inputToSearch.split(" ");
  //     const idArray = getAllWords(inputToSearchArray);
  //     if (inputToSearchArray[0].length > 2) displayFiltersList(recipeListFromIdArray(idArray));
  //   });
  // }

  displayTag() {
    const tagListIngredient = getActiveFilter("ingredients");
    const tagListAppliance = getActiveFilter("appliance");
    const tagListUstensil = getActiveFilter("ustensils");
    const container = document.querySelector(".filterTagContainer");
    let temp = "";
    tagListIngredient.forEach((value) => {
      temp += this.templateTag(value, "ingredients");
    });
    tagListAppliance.forEach((value) => {
      temp += this.templateTag(value, "appliance");
    });
    tagListUstensil.forEach((value) => {
      temp += this.templateTag(value, "ustensils");
    });
    container.innerHTML = temp;
  }

  /**
   * Retourne le template  du tag sélectionné
   *
   * @param   {string}  name   Le nom correspondant au tag choisi
   * @param   {string}  color  La couleur correspondant à la liste de filtre à laquelle appartient le tag
   *
   * @return  {String}         Retourne le tag
   */
  templateTag(name, type) {
    const template = /*html*/ `
    <span class="filterTag btn text-light ${type}">
      <span class="lh-1">${name}</span>
      <span class="far fa-times-circle align-middle filterTagIcon lh-1" onclick="deleteElement('${name}', '${type}')"></span>
    </span>
  `;
    return template;
  }

  deleteTag(name, type) {
    removeFilterTag(type, name);
    this.displayTag();
  }

  selectTag(name, type) {
    addFilterTag(type, name);
    const color = getColorFromId(type);
    this.displayTag(name, color);
    closeAllExceptSelected();
  }
}

// export {
//   displayFilter,
//   displayTag,
//   getFilterInput,
//   toggleFilter,
// };