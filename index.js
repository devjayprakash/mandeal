require("dotenv").config();
let express = require("express");
let morgan = require("morgan");
let cors = require("cors");
let bodyParser = require("body-parser");
let helmet = require("helmet");
let routes = require("./routes");

//constants
let isDev = process.env.PORT !== "production";

let app = express();

//database
require("./database");

//all the middlewares
app.use(cors({}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use("/api/v1", routes);

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    msg:
      "There was some problem. Please check your request or try again after some time",
    res: false,
    error: isDev ? err : "Please contact the developer for more info",
  });
});

//starting the server
let PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started successfully on port ${PORT}`);
});
