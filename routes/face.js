/////////////////////////////////////////////////////// face integration route //////////////////////////////////
var express = require("express");
var router = express.Router();

let multer = require("multer");
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

// Create a connection to the database
const conn = mysql.createConnection(dBOptions);
conn.connect((err) => {
  if (err) throw err;
});

//HOME
//GET Home
router.get("/", (req, res, next) => {
  res.redirect("/face/login");
});

// ==================================> SIGN UP

router.post("/url", upload.none(), (request, response) => {
  const data = request.body;
  const firstName = data.firstName;
  const lastName = data.lastName;
  const email = data.email;
  const base64image = data.base64image;

  console.log(email);
  // console.log(base64image)
  conn.query("SELECT * FROM users WHERE email = ?", email, async function (
    err,
    results,
    fields
  ) {
    try {
      if (err) throw err;
      if (results.length > 0) {
        response.redirect("/face/index");
      } else {
        let sqlRegister =
          "INSERT INTO users(firstname, lastname, email, password, profile_pic, role_id, base64image) VALUES (?)";
        let values = [
          firstName,
          lastName,
          email,
          "1",
          "user.png",
          2,
          base64image,
        ];
        conn.query(sqlRegister, [values], function (err) {
          if (err) throw err;
          response.redirect("/face/");
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

//GET Login
router.get("/login", (req, res, next) => {
  res.render("face/login");
});

//GET Home
router.get("/home", (req, res, next) => {
  res.render("face/home");
});

//GET Index
router.get("/index", (req, res, next) => {
  res.render("face/index");
});

router.post("/faceid", upload.none(), (req, res, next) => {
  const email = req.body.email;

  conn.query("SELECT * FROM users WHERE email = ?", email, async function (
    err,
    results,
    fields
  ) {
    try {
      if (err) throw err;
      if (results.length < 1) {
        // req.session.message = "This email doesn't exist in our database.";
        console.log("This email doesn't exist in our database.");
        res.redirect("/face/login");
      } else {
        vall = results[0];
        res.render("face/faceid", {
          vall,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

router.post("/login", upload.none(), (req, res) => {
  const login = req.body;
  let email = login.email;
  console.log(login);
  conn.query("SELECT * FROM users WHERE email = ?", email, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.email = email;

      if (results[0].role_id == 2 || results[0].role_id == 3) {
        req.session.message = "";
        return res.redirect("/users/home");
      } else if (results[0].role_id == 1) {
        req.session.message = "";
        return res.redirect("/admin/home");
      }
    } else {
      req.session.message = "Incorrect username or password";
      return res.redirect("/");
    }
  });
});

/////////////////////////////////////////////////////// face integration route //////////////////////////////////

module.exports = router;
