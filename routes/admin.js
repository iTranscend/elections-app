var express = require("express");
var router = express.Router();
let multer = require("multer");
let upload = multer();
// Load mysql config
const mysql = require("mysql");
let dBOptions = require("../utils/db");

// Create a connection to the database
const conn = mysql.createConnection(dBOptions);
conn.connect((err) => {
  if (err) throw err;
});

router.get("/home", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    req.session.email,
    function (error, results, fields) {
      if (error) throw error;
      res.render("admin/home", {
        title: "Elections",
        msg: "Successful login",
        details: results[0],
      });
    }
  );
});

router.get("/candidates", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  conn.query(
    `SELECT u.firstname AS firstname, u.lastname AS lastname, u.email AS email, c.id AS candidate_id, c.position_id AS position_id, p.name 
  FROM users u
  JOIN candidates c ON u.id = c.user_id
  JOIN position p ON c.position_id = p.id`,
    function (error, results, fields) {
      if (error) throw error;
      res.render("admin/home", {
        title: "Elections",
        msg: "Successful login",
        candidates: results,
      });
    }
  );
});

router.post("/createPosition", upload.none(), function (req, res, next) {
  let position = req.body.position;
  console.log(position);

  conn.query("INSERT INTO positions(name) VALUES (?)", position, function (
    error
  ) {
    if (error) throw error;
  });
  res.redirect("/admin/home");
});

router.get("/results", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  conn.query("", function (error, results, fields) {
    if (error) throw error;
    res.render("admin/results", {
      title: "Elections",
      msg: "Successful login",
      candidates: results,
    });
  });
});

module.exports = router;
