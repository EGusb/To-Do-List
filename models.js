const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dbFullPath = `${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(dbFullPath);

const itemSchema = {
  name: {
    type: String,
    required: [true, "The item must have a name!"],
  },
};

const listSchema = {
  name: {
    type: String,
    required: [true, "The list must have a name!"],
  },
  items: [itemSchema],
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

exports.Item = Item;
exports.List = List;
