let express = require("express");
let router = express.Router();
// let bodyParser = require("body-parser");
// let urlencodedParser = bodyParser.urlencoded({ extended: false });
let multer = require("multer");
let storage = multer.diskStorage({
  destination: function (re, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload = multer({ storage: storage });

// Load mysql config
const mysql = require("mysql");
let dBOptions = require("../utils/db");

// Create a connection to the database
const conn = mysql.createConnection(dBOptions);
conn.connect((err) => {
  if (err) throw err;
});

/* GET landing/login page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Elections" });
});

router.post("/login", upload.none(), function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  if (email && password) {
    conn.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.email = email;

          if (results[0].role_id == 1) {
            res.redirect("/admin/home");
          } else if (results[0].role_id == 2 || results[0].role_id == 3) {
            res.redirect("/users/home");
          }
        } else {
          res.send("Incorrect email and/or Password!");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter email and Password!");
    res.end();
  }
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Elections" });
});

router.post("/register", upload.single("image"), function (req, res, next) {
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let image = req.file.filename;

  let sqlRegister =
    "INSERT INTO users(firstname, lastname, email, password, profile_pic, role_id) VALUES (?)";
  let values = [firstName, lastName, email, password, image, 3];

  conn.query(sqlRegister, [values], function (err) {
    if (err) throw err;
  });
  res.render("index", {
    title: "Elections",
    msg: "Registration Successful! Proceed to login.",
  });
});

module.exports = router;
