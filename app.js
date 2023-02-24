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

const models = require(__dirname + "/models.js");
const Item = models.Item;
const List = models.List;

function slugify(name) {
  return _.kebabCase(_.toLower(_.deburr(name)));
}

app.get("/", function (req, res) {
  List.find({}, function (err, docs) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.render("home", {
        lists: docs,
      });
    }
  });
});

app.post("/", function (req, res) {
  const newListName = req.body.newListName;
  const newListSlug = slugify(newListName);

  List.findOne({ slug: newListSlug }, function (err, list) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      if (list) {
        res.redirect("/");
      } else {
        List.create(
          {
            name: newListName,
            slug: newListSlug,
            items: [],
          },
          function (err, doc) {
            if (err) {
              console.log(err);
              res.render("error", { error: err });
            } else {
              res.redirect("/");
            }
          }
        );
      }
    }
  });
});

app.post("/delete", function (req, res) {
  const checkedListId = req.body.listCheckBox;
  List.findByIdAndRemove(checkedListId, function (err) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      res.redirect("/");
    }
  });
});

app.get("/:listSlug", function (req, res) {
  const listSlug = req.params.listSlug;

  List.findOne({ slug: listSlug }, function (err, list) {
    if (err) {
      console.log(err);
      res.render("error", { error: err });
    } else {
      if (list) {
        res.render("list", { list: list });
      } else {
        res.redirect("/");
      }
    }
  });
});

app.post("/:listSlug", function (req, res) {
  const newItemName = req.body.newItemName;
  const listSlug = req.params.listSlug;

  List.findOneAndUpdate(
    { slug: listSlug },
    { $push: { items: { name: newItemName } } },
    function (err, list) {
      if (err) {
        console.log(err);
        res.render("error", { error: err });
      } else {
        if (list) {
          res.redirect(`/${listSlug}`);
        } else {
          res.redirect("/");
        }
      }
    }
  );
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
