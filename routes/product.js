let router = require("express").Router();
let Product = require("../database/modals/product");
let multer = require("multer");
let { uuid } = require("uuidv4");

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/createProduct", upload.single("image"), (req, res, next) => {
  const url = req.protocol + "://" + "localhost:8080" + "/" + req.file.filename;
  let data = req.body;
  data.image = url;
  data.mppk = JSON.parse(data.mppk);
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

router.get("/searchProduct/:query", (req, res) => {
  let query = req.params.query;

  Product.find(
    { name: { $regex: query, $options: "i" } },
    function (err, docs) {
      res.send({
        res: true,
        docs: docs,
      });
    }
  );
});

router.post("/updateProduct/:id", (req, res) => {
  let id = req.params.id;
  let data = req.body;
  Product.updateOne({ _id: id }, data, (err, doc) => {
    if (err) next(err);
    res.send({
      res: true,
      msg: "the product has been updated sucessfully",
    });
  });
});

router.get("/getDetail/:id", (req, res) => {
  let id = req.params.id;
  Product.findById(id)
    .populate("createdBy")
    .then((doc) => {
      res.send({
        res: true,
        doc: doc,
      });
    });
});

router.get("/getAllProducts/:id", (req, res) => {
  let id = req.params.id;
  Product.find({ createdBy: id })
    .populate("createdBy")
    .then((result) => {
      console.log(result);

      res.send({
        res: true,
        msg: "all product",
        products: result,
      });
    });
});

router.get("/getLast30Products", (req, res) => {
  Product.find()
    .limit(30)
    .populate("createdBy")
    .then((result) => {
      res.send({
        res: true,
        products: result,
      });
    });
});

router.post("/setSold", (req, res) => {
  let proId = req.body.productId;
  Product.updateOne({ _id: proId }, { done: req.body.done }).then((val) => {
    res.send({
      res: true,
    });
  });
});

module.exports = router;
