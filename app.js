require("dotenv").config();

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("static"));



const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
