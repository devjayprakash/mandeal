let router = require("express").Router();
let Bid = require("../database/modals/bid");

router.post("/makeBid", (req, res, next) => {
  let data = req.body;
  let bid = new Bid(data);
  bid
    .save()
    .then((doc) => {
      res.send({
        res: true,
        msg: "the bid was made successfully",
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/getAllBids/:productId", (req, res) => {
  let id = req.params.productId;
  Bid.find({ product: id })
    .populate("createdBy")
    .populate("createdFor")
    .populate("product")
    .then((docs) => {
      res.send({ res: true, docs: docs });
    });
});

router.delete("/deleteBid/:bidId", (req, res, next) => {
  let id = req.params.bidId;

  Bid.remove({ _id: id }, (err) => {
    if (err) next(err);

    res.send({
      res: true,
      msg: "Bid removed successfully",
    });
  });
});

module.exports = router;
