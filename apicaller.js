var numRecents = 5;
var hashNames = [];

// For testing purposes
function renderHashData(hashNames) {
  for(var i=0; i < hashNames.length; i++) {
    console.log(hashNames[i]);
  }
};

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Returns an array with the initial metadata for blocks
function callAPI() {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://blockchain.info/latestblock', false);  // `false` makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    var currHash = JSON.parse(request.responseText)['hash'];
    while (numRecents > 0) {
      request.open('GET', 'https://blockchain.info/rawblock/' + currHash, false);
      request.send(null);
      numRecents--;
      if (request.status === 200) {
        resp = JSON.parse(request.responseText);

        // Convert epoch time to date
        var date = new Date(0);
        date.setUTCSeconds(resp['time']);

        var desc = 'Hash: ' + resp['hash'] + '\n'
          + 'Time Created: ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '\n';
        hashNames.push(desc);
        currHash = resp['prev_block'];
      }
    }
  }
  return hashNames;
}

// renderHashData(callAPI());
// module.exports = {
//   callAPI: function () {
//     https.get(options, callbackMostRecent).end();
//     return hashNames;
//   }
// };
