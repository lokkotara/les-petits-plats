const ref = {
  "word1" : [12, 14,44],
  "word2" : [1, 3,4],
  "word3" : [2, 3, 44]
};

/**
 * [getAllWords description]
 *
 * @param   {String | Array.<String>}  words  [words description]
 *
 * @return  {Array.<Number>}        [return description]
 */
function getAllWords(words){
  if (typeof words === "string") return ref[words];
  let res = [];
  words.forEach( word => {
    res = getIntersectArray(res, ref[word]);
  });
  return res;
}

function getIntersectArray(arrayA, arrayB){
  if (arrayA.length===0) return arrayB;

  const intersect = [...new Set(arrayA)].filter((elt) => [...new Set(arrayB)].includes(elt));
  return intersect;
}

console.log(getAllWords(["word1", "word3"]));

function getIntersectArray(arrayA, arrayB){
  if (arrayA === null) return arrayB;

  const intersect = [...new Set(arrayA)].filter((elt) => [...new Set(arrayB)].includes(elt));
  return intersect;
}