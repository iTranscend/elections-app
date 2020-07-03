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
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Get admin details
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        if (error) throw error;
        // Get Positions
        conn.query("SELECT * FROM positions", function (
          error,
          positions,
          fields
        ) {
          if (error) throw error;
          res.render("admin/home", {
            title: "Elections",
            message: req.session.message,
            user: results[0],
            positions,
          });
        });
      }
    );
  }
});

router.get("/candidates", function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    conn.query(
      `SELECT u.firstname AS firstname, u.lastname AS lastname, u.email AS email, c.id AS candidate_id, c.position_id AS position_id, c.is_approved AS status, p.name AS position_name 
    FROM users u
    JOIN candidates c ON u.id = c.user_id
    JOIN positions p ON c.position_id = p.id`,
      function (error, results, fields) {
        if (error) throw error;
        req.session.message = "";
        res.render("admin/candidates", {
          title: "Elections",
          message: req.session.message,
          candidates: results,
        });
      }
    );
  }
});

router.post("/approve/:id", upload.none(), function (req, res, next) {
  let userID = req.params.id;
  console.log(userID);

  conn.query(
    "UPDATE `candidates` SET `is_approved` = '1' WHERE `candidates`.`id` = ?",
    userID,
    function (error) {
      if (error) throw error;

      res.redirect("/admin/candidates");
    }
  );
});

router.post("/disapprove/:id", upload.none(), function (req, res, next) {
  let userID = req.params.id;
  console.log(userID);

  conn.query(
    "UPDATE candidates SET is_approved = '0' WHERE id = ?",
    userID,
    function (error) {
      if (error) throw error;
    }
  );
  res.redirect("/admin/candidates");
});

router.post("/createPosition", upload.none(), function (req, res, next) {
  let position = req.body.position;
  console.log(position);

  conn.query("INSERT INTO positions(name) VALUES (?)", position, function (
    error
  ) {
    if (error) throw error;
    req.session.message = "Post Created";
    res.redirect("/admin/home");
  });
});

router.post("/voterDeadline", upload.none(), function (req, res, next) {
  let deadline = req.body.voter_deadline;
  conn.query(
    "INSERT INTO deadlines (name, value) VALUES (voter_deadline, ?)",
    deadline,
    function (error) {
      if (error) throw error;
      res.redirect("admin/home");
    }
  );
});

router.get("/results", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  } else {
    conn.query("", function (error, results, fields) {
      if (error) throw error;
      res.render("admin/results", {
        title: "Elections",
        message: req.session.message,
        candidates: results,
      });
    });
  }
});

module.exports = router;
