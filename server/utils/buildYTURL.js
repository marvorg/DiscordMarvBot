buildYT = function(searchTerms){
  var search = ''
  for (i in searchTerms){
    if (i < searchTerms.length){
      search += searchTerms[i];
      search += ',';
    } else {
      search += searchTerms[i];
    }
  }
  return search;
}
