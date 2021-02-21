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
  console.log(data);

  User.exists({ phone: data.phone }, (err, result) => {
    if (err) next(err);
    if (result === false) {
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
              { name: doc.name, phone: doc.phone },
              process.env.JWT_PASS,
              {
                expiresIn: "2h",
              }
            );
            res.cookie("jwt", token);
            res.send({
              userdata: doc,
              res: true,
              msg: "User registerd successfully",
            });
          })
          .catch((err) => {
            next(err);
          });
      });
    } else {
      res.send({
        res: false,
        msg: "User with the give phone number already registered",
      });
    }
  });
});

/**
 * this i the login route [remember that the request type should be post]
 */

router.post("/login", (req, res) => {
  let { phone, password } = req.body;

  User.exists({ phone }, (err, result) => {
    if (err) next(err);

    console.log({ err, result });

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
              let token = jwt.sign(
                { name: doc.name, phone: doc.phone },
                process.env.JWT_PASS,
                {
                  expiresIn: "2h",
                }
              );
              res.cookie("jwt", token);

              res.send({
                userdata: doc,
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

router.post("/verifyToken", (req, res) => {
  let token = req.body.token;
  jwt.verify(token, process.env.JWT_PASS, (err, decoded) => {
    if (err) next(err);
    User.exists({ phone: decoded.phone }, (err, result) => {
      if (err) next(err);
      console.log(decoded);
      if (result === true) {
        User.findOne({ phone: decoded.phone }, (err, doc) => {
          if (err) next(err);
          console.log(doc);
          res.send({
            userdata: doc,
            res: true,
          });
        });
      } else {
        res.send({
          res: false,
          msg: "User with the following token does not found in the database",
        });
      }
    });
  });
});

module.exports = router;
