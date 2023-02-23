require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("static"));

let toDoItems = [];
const dateModule = require(__dirname + "/date.js");

app.get("/", function (req, res) {
  res.render("list", {
    dayString: dateModule.dayString(),
    toDoItems: toDoItems,
  });
});

app.post("/", function (req, res) {
  const newItem = req.body.newItem;
  toDoItems.push(newItem);

  res.render("list", {
    dayString: dateModule.dayString(),
    toDoItems: toDoItems,
  });
});

const hostname = process.env.HOST || "localhost";

// HTTP config
const http_port = process.env.HTTP_PORT || 80;
const http_server = http.createServer(app);

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

// HTTPS config
const https_port = process.env.HTTPS_PORT || 443;
const https_server = https.createServer(options, app);

http_server.listen(http_port, hostname, function () {
  console.log(`HTTP server started on http://${hostname}:${http_port}`);
});

https_server.listen(https_port, hostname, function () {
  console.log(`HTTPS server started on https://${hostname}:${https_port}`);
});
