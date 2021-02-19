require("dotenv").config();
let express = require("express");
let morgan = require("morgan");
let cors = require("cors");
let bodyParser = require("body-parser");
let helmet = require("helmet");

let app = express();

//all the middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

//starting the server
let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
