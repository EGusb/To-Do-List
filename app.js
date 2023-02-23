require("dotenv").config();

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("static"));

const dateModule = require(__dirname + "/date.js");
const models = require(__dirname + "/models.js");
const Item = models.Item;
const List = models.List;

app.get("/", function (req, res) {
  Item.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.render("list", {
        listTitle: dateModule.dayString(),
        toDoItems: docs,
      });
    }
  });
});

app.post("/", function (req, res) {
  Item.create({ name: req.body.newItem });

  Item.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.redirect("/");
    }
  });
});

app.get("/:listName", function (req, res) {
  const listName = _.capitalize(req.params.listName);

  Item.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.render("list", {
        listTitle: listName,
        toDoItems: docs,
      });
    }
  });
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.itemCheckBox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.redirect("/");
    }
  });
});

// HTTP config
const http_port = process.env.HTTP_PORT || 80;
const http_server = http.createServer(app);

// HTTPS config
const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const https_port = process.env.HTTPS_PORT || 443;
const https_server = https.createServer(options, app);

const hostname = process.env.HOST || "localhost";

http_server.listen(http_port, hostname, function () {
  console.log(`HTTP server started on http://${hostname}:${http_port}`);
});

https_server.listen(https_port, hostname, function () {
  console.log(`HTTPS server started on https://${hostname}:${https_port}`);
});
