const mongoose = require("mongoose");
const dbFullPath = process.env.DB_FULL_PATH;

mongoose.set("strictQuery", false);
mongoose.connect(dbFullPath);

const Item = mongoose.model("Item", {
  name: {
    type: String,
    required: [true, "The item must have a name!"],
  },
});

exports.Item = Item;
