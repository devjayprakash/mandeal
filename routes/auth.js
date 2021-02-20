let router = require("express").Router();
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let User = require("../database/modals/user");

/**
 * Don't worry about the data validation. it will be taken care by mongoose
 * and it will automatically go to the error handler.
 *
 * But it is important to validate the data in the frontend
 */

router.post("/signup", (req, res, next) => {
  let data = req.body;

  //passoword hashing and salting
  bcrypt.hash(data.password, 10, (err, enc_pass) => {
    if (err) next(err);

    data.password = enc_pass;

    //saveing the data to the database
    let user = new User(data);
    user
      .save()
      .then((doc) => {
        //generating the token
        let token = jwt.sign(
          { name: doc.name, phone: doc.name },
          process.env.JWT_PASS
        );
        res.cookie("jwt", token);
        res.send({
          msg: "User registerd successfully",
        });
      })
      .catch((err) => {
        next(err);
      });
  });
});

/**
 * this i the login route [remember that the request type should be post]
 */

router.post("/login", (req, res) => {
  let { phone, password } = req.body;

  User.exists({ phone, password }, (err, result) => {
    if (err) next(err);

    if (result) {
      //getting the user data from the database
      User.findOne({ phone })
        .then((doc) => {
          //now we will check the password
          let hash = doc.password;
          bcrypt.compare(password, hash, (err, same) => {
            if (err) next(err);
            if (same) {
              //successful login
              res.send({
                res: true,
                msg: "Your login successful.",
              });
            } else {
              res.status(403).send({
                res: false,
                msg: "The password you have entered is incorrect",
              });
            }
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      res.status(403).send({
        res: false,
        msg: "No user was found from the given detail",
      });
    }
  });
});

module.exports = router;
