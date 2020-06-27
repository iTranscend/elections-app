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

// Voter homepage
router.get("/home", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    req.session.email,
    function (error, results, fields) {
      if (error) throw error;
      console.log(results[0].firstname);
      res.render("user/home", {
        title: "Elections",
        msg: "Successful login",
        user: results[0],
      });
    }
  );
});

// Update Profile route
router.get("/profile", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  }
  conn.query(
    "SELECT * FROM users WHERE email = ?",
    req.session.email,
    function (error, results, fields) {
      if (error) throw error;
      let user = results[0];
      // Get available positions
      conn.query("SELECT * FROM positions", function (error, rows, fields) {
        if (error) throw error;
        let positions = rows;
        console.log(positions);
        // Render page
        res.render("user/profile", {
          title: "Elections",
          msg: "Successful login",
          user: user,
          positions: positions,
        });
      });
    }
  );
});

router.post("/apply/:id", upload.none(), function (req, res, next) {
  let positionID = req.body.position;
  console.log(positionID);
  let userID = req.params.id;
  console.log(userID);
  let values = [positionID, userID];

  conn.query(
    "INSERT INTO candidates(position_id, user_id) VALUES (?)",
    [values],
    function (error) {
      if (error) throw error;
    }
  );
  conn.query(
    "UPDATE users SET role_id = 3 WHERE email = ?",
    req.session.email,
    function (error) {
      if (error) throw error;
    }
  );
  res.redirect("/users/profile");
});

module.exports = router;
