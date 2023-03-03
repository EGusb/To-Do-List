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
const List = models.List;

function slugify(name) {
  return _.kebabCase(_.toLower(_.deburr(name)));
}

function renderErrorPage(res, err, statusCode, msg = "ERROR") {
  let msgShow = "";
  if (err === null) {
    msgShow = msg;
  } else {
    msgShow = err.message || msg;
    console.log(err);
  }
  res.status(statusCode).render("error", {
    statusCode: statusCode,
    message: msgShow,
  });
}

app.get("/", function (req, res) {
  List.find({}, function (err, docs) {
    if (err) {
      renderErrorPage(res, err, 500);
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
      renderErrorPage(res, err, 500);
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
          function (err1, doc) {
            if (err1) {
              renderErrorPage(res, err1, 500);
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
      renderErrorPage(res, err, 500);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/:listSlug", function (req, res) {
  const listSlug = req.params.listSlug;

  List.findOne({ slug: listSlug }, function (err, list) {
    if (err) {
      renderErrorPage(res, err, 500);
    } else {
      if (list) {
        res.render("list", { list: list });
      } else {
        renderErrorPage(res, err, 404, "Page not found.");
      }
    }
  });
});

app.get("/:listSlug/edit", function (req, res) {
  const listSlug = req.params.listSlug;

  List.findOne({ slug: listSlug }, function (err, list) {
    if (err) {
      renderErrorPage(res, err, 500);
    } else {
      if (list) {
        res.render("list-edit", { list: list });
      } else {
        renderErrorPage(res, err, 404, "Page not found.");
      }
    }
  });
});

app.post("/:listSlug/edit", function (req, res) {
  const newListName = req.body.newListName;
  const listId = req.body.listId;
  const newSlug = slugify(newListName);

  List.findOneAndUpdate(
    { _id: listId },
    { name: newListName, slug: newSlug},
    function (err, list) {
      if (err) {
        renderErrorPage(res, err, 500);
      } else {
        if (list) {
          res.redirect(`/${newSlug}`);
        } else {
          res.redirect("/");
        }
      }
    }
  );
});

app.post("/:listSlug/item/add", function (req, res) {
  const newItemName = req.body.newItemName;
  const listSlug = req.params.listSlug;

  List.findOneAndUpdate(
    { slug: listSlug },
    { $push: { items: { name: newItemName } } },
    function (err, list) {
      if (err) {
        renderErrorPage(res, err, 500);
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

app.post("/:listSlug/item/delete", function (req, res) {
  const itemId = req.body.itemId;
  const listSlug = req.params.listSlug;

  List.findOneAndUpdate(
    { slug: listSlug },
    { $pull: { items: { _id: itemId } } },
    function (err, list) {
      if (err) {
        renderErrorPage(res, err, 500);
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
