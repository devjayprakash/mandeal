let router = require("express").Router();
let Product = require("../database/modals/product");

router.post("/createProduct", (req, res) => {
  let data = req.body;
  let product = new Product(data);
  product
    .save()
    .then((doc) => {
      res.send({
        res: true,
        msg: "The product has been created sucessfully",
        id: doc._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deleteProduct/:id", (req, res) => {
  let id = req.params.id;
  Product.remove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.send({
        res: true,
        msg: "The product was deleted sucessfully",
      });
    } else {
      next(err);
    }
  });
});

router.post("/updateProduct/:id", (req, res) => {
  let id = req.params.id;
  let data = req.body;
  Product.updateOne({ _id: id }, data, (err, doc) => {
    if (err) next(err);
    res.send *
      {
        res: true,
        msg: "the product has been updated sucessfully",
      };
  });
});

module.exports = router;
