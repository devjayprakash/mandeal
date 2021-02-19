let mongoose = require("mongoose");

mongoose.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

db.on("open", () => {
  console.log("Conncected to the database successfully");
});

db.once("error", () => {
  console.error("There was some problem connecting to the database");
});
