"use strict";

const PORT            = process.env.PORT || 8080;
const express         = require("express");
const bodyParser      = require("body-parser");
const sass            = require("node-sass-middleware");
const app             = express();
const morgan          = require('morgan');
const request         = require('request');
// const APICaller       = require('./apicaller');
const https           = require('https');
const WebSocket       = require('ws');
const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// let blocks = [];

// API Call
var numRecents = 5;
var hashNames = [];
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
        var resp = JSON.parse(request.responseText);

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
  console.log(hashNames);
  return hashNames;
}

// WebSocket connection
// function establishWS (res) {
//   const wsUri = 'wss://ws.blockchain.info/inv';
//   const ws = new WebSocket(wsUri);
//   if (ws) {
//     ws.on('open', () => {
//       ws.send('{"op":"ping"}');
//       ws.send('{"op":"blocks_sub"}');
//     });
//     ws.on('message', (data) => {
//       onMessage(data);
//       // res.render("index", { blocks: hashNames });
//     });
//   }
// }

// function onMessage(data) {
//   console.log(data);
//   // hashNames.push(data.hash);
// }

// Home page
app.get("/", (req, res) => {
  // request('https://blockchain.info/latestblock', function (error, response, body) {
  //   let tmp = [];
  //   tmp.push(body);
  //   if (blocks.length === 5) {
  //     blocks.splice(0, 1);
  //     blocks.push(tmp);
  //   } else {
  //     blocks.push(tmp);
  //   }
  // });
  // console.log(blocks.length);
  const blocks = callAPI();
  // establishWS(res);
  res.render("index", { blocks: blocks });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
