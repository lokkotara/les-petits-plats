let filterName;
function displayFilter(name, list, placeholder, color) {
  filterName = name;
  return `
  <div class="filterContainer text-light p-2 rounded d-flex align-items-center" style="background-color: ${color};">
  <label id="${name}-filter-label" for="${name}" class="d-flex justify-content-between align-items-center container">
  <span  class="${name}FilterSpan">${name}</span>
  <input type="text" id="ingredient" placeholder="Rechercher un ingrédient" class="openedFilter" hidden/>
  <i class="fas fa-chevron-down" id="${name}-filter-icon"></i>
  </label>
  </div>
  `;
}

function toggleFilter(filterName) {
  const span = document.querySelector(`${filterName.target.className}`);
  console.log(span);
}

export {
  displayFilter,
  toggleFilter
}