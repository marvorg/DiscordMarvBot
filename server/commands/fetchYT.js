function execute(searchTerms) {
  return gapi.client.youtube.search.list({
    "part": "snippet",
    "q": searchTerms,
    "type": "video"
  }).then(function(response) {
    // Handle the results here (response.result has the parsed body).
    console.log("Response", response);
  },
    function(err) { console.error("Execute error", err); 
  });
}
