let router = require("express").Router();
let auth = require("./auth");
let product = require("./product");
let bid = require("./bid");

router.use("/auth", auth);
router.use("/product", product);
router.use("/bid", bid);

module.exports = router;
