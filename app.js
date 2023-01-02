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

app.get("/", function (req, res) {
  const today = new Date();
  const dayString = today.toLocaleDateString("es-AR", {
    weekday: "long",
    hour12: false,
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  res.render("list", { dayString: dayString });
});

const hostname = process.env.HOST || "localhost";

const http_port = process.env.HTTP_PORT || 80;
const http_server = http.createServer(app);

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const https_port = process.env.HTTPS_PORT || 443;
const https_server = https.createServer(options, app);

http_server.listen(http_port, hostname, function () {
  console.log(`HTTP server started on http://${hostname}:${http_port}`);
});

https_server.listen(https_port, hostname, function () {
  console.log(`HTTPS server started on https://${hostname}:${https_port}`);
});
