export function objectCompare(x, y) {
  return JSON.stringify(x) === JSON.stringify(y);
}
//###################################################################
export function isObjectInArray(obj, arr) {
  var flag = false;
  for (var element in arr) {
    if (objectCompare(arr[element], obj)) {
      flag = true;
      break;
    }
  }
  return flag;
}
//###################################################################
export function arrayRemove(arr, value) {
  if (!arr || !value) return arr;
  return arr.filter(function(element) {
    return element !== value;
  });
}
