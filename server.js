"use strict";

const PORT        = process.env.PORT || 8080;
// const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const morgan      = require('morgan');

const request     = require('request');

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

// In memory object
let blocks = [];

// Home page
app.get("/", (req, res) => {
  request('https://blockchain.info/latestblock', function (error, response, body) {
    // console.log('error:', error);
    // console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);
    let tmp = [];
    tmp.push(body);
    if (blocks.length === 5) {
      blocks.splice(0, 1);
      blocks.push(tmp);
    } else {
      blocks.push(tmp);
    }
  });
  // console.log(blocks.length);
  res.render("index", { blocks: blocks });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
