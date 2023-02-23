const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dbFullPath = `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(dbFullPath);

const Item = mongoose.model("Item", {
  name: {
    type: String,
    required: [true, "The item must have a name!"],
  },
});

exports.Item = Item;
