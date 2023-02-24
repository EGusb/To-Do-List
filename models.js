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
  slug: {
    type: String,
    required: [true, "The slug must not be blank!"],
  },
  items: [itemSchema],
};

exports.Item = mongoose.model("Item", itemSchema);
exports.List = mongoose.model("List", listSchema);
