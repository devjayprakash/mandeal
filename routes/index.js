let router = require("express").Router();
let auth = require("./auth");
let product = require("./product");

router.use("/auth", auth);
router.use("/product", product);

module.exports = router;
