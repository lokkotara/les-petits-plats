function exposeMethods(functions){
  for ( const [key, value] of Object.entries(functions)) {
    window[key] = value;
  }
}

export {
  exposeMethods
};