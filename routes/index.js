let express = require("express");
let router = express.Router();
let multer = require("multer");
// var path = require("path");
// let bodyParser = require("body-parser");
// let urlencodedParser = bodyParser.urlencoded({ extended: false });
let storage = multer.diskStorage({
  destination: function (re, file, cb) {
    cb(null, "./public/uploads");
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + " is starting ...");
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + " uploaded to  " + file.path);
    done = true;
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        file.originalname.substring(file.originalname.lastIndexOf("."))
    );
  },
});
let upload = multer({ storage: storage });

// Load mysql config
const mysql = require("mysql");
let dBOptions = require("../utils/db");
const { path } = require("../app");

// Create a connection to the database
const conn = mysql.createConnection(dBOptions);
conn.connect((err) => {
  if (err) throw err;
});

/* GET landing/login page. */
router.get("/", function (req, res, next) {
  res.render("index", { message: req.session.message, title: "Elections" });
  // delete req.session.message;
});

router.post("/login", upload.none(), function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  conn.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    function (error, results, fields) {
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.email = email;

        if (results[0].role_id == 2 || results[0].role_id == 3) {
          req.session.message = "Login Successful";
          return res.redirect("/users/home");
        } else if (results[0].role_id == 1) {
          req.session.message = "Login Successful";
          return res.redirect("/admin/home");
        }
      } else {
        req.session.message = "Incorrect username or password";
        return res.redirect("/");
      }
    }
  );
});

router.post("/logout", async function (req, res, next) {
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Elections" });
});

router.post("/register", upload.single("profilePic"), async function (
  req,
  res,
  next
) {
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;
  let image = req.file.filename;

  let sqlRegister =
    "INSERT INTO users(firstname, lastname, email, password, profile_pic, role_id) VALUES (?)";
  let values = [firstName, lastName, email, password, image, 2];

  await conn.query(sqlRegister, [values], function (err) {
    if (err) throw err;
  });

  req.session.message = "Registration Successful! Proceed to login.";
  res.render("index", {
    title: "Elections",
    message: req.session.message,
  });
});

module.exports = router;
