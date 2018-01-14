// This file just makes calls to the blockchain API to print the hash of most recent 5 blocks

const https = require('https');
var numRecents = 5;

var hashNames = [];

var options = {
  host: 'blockchain.info',
  path: '/latestblock',
  headers: {'Accept' : 'application/json'}
};

var callbackMostRecent = function (response) {
  var str = '';
  // A chunk of data has been received
  response.on('data', function (chunk) {
    str += chunk;
  });

  // The whole response has been received
  response.on('end', function () {
    // Parse the response and set the locals to be used by the client
    var resp = JSON.parse(str);
    options['path'] = '/rawblock/' + resp['hash'];
    https.get(options, callback);

  });
};

var callback = function (response) {
  var str = '';
  // A chunk of data has been received
  response.on('data', function (chunk) {
    str += chunk;
  });

  // The whole response has been received
  response.on('end', function () {
    // Parse the response and set the locals to be used by the client
    var resp = JSON.parse(str);
    numRecents--;
    hashNames.push(resp['hash']);
    if (numRecents > 0) {
      options['path'] = '/rawblock/' + resp['prev_block'];
      https.get(options, callback);
    } else {
      // Call function implemented by Andy
      renderHashData(hashNames);
    }
  });
};

// This is just a stub for Andy
function renderHashData(hashNames) {
  for(var i=0; i < hashNames.length; i++) {
    console.log(hashNames[i]);
  }
}

https.get(options, callbackMostRecent).end();
