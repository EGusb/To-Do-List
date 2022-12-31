require("dotenv").config();

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests
app.use(express.static("static"));

app.get("/", function (req, res) {
  const day = [
    { name: "Sunday", color: "black" },
    { name: "Monday", color: "red" },
    { name: "Tuesday", color: "green" },
    { name: "Wednesday", color: "yellor" },
    { name: "Thursday", color: "purple" },
    { name: "Friday", color: "grey" },
    { name: "Saturday", color: "brown" },
  ][new Date().getDay()];

  res.render("list", {
    day: day.name,
    color: day.color,
  });
});

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
