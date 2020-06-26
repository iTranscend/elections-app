var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/home", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  res.render("home", {
    title: "Elections",
    msg: "Successful login",
  });
});

module.exports = router;
