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
router.get("/home", async function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    return res.redirect("/");
    next();
  } else {
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      req.session.email,
      async function (error, results, fields) {
        if (error) throw error;
        await console.log(results[0].firstname);

        conn.query(
          "SELECT id, name FROM positions ORDER BY id",
          async function (err, positions, fields) {
            let candidacy = [];
            if (err) throw err;
            await console.log("Positions:", positions);
            await positions.forEach(async (element) => {
              conn.query(
                "SELECT u.firstname AS firstname, u.lastname AS lastname, u.profile_pic AS profile_pic, c.id AS candidate_id FROM users u JOIN candidates c ON u.id = c.user_id JOIN positions p ON p.id = c.position_id WHERE c.is_approved = 1 and p.id = ? ORDER BY p.id",
                element.id,
                async function (error, candidates, fields) {
                  if (error) throw error;
                  // await console.log(candidates);
                  // Formation of the compound object to be sent back to user
                  candidacy[element.name] = candidates;
                  candidacy[element.name] = {
                    id: element.id,
                    candidates,
                  };
                }
              );
            });
            await setTimeout(async () => {
              await console.log("Candidacy:", candidacy);
              return res.render("user/home", {
                title: "Elections",
                message: req.session.message,
                user: results[0],
                candidacy,
              });
            }, 4000);
            // req.session.message = "";
            // await getCandidates(positions).then((candidacy, results) => {
            // });
          }
        );
      }
    );
  }
});

// Update Profile route
router.get("/profile", function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
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
            message: req.session.message,
            user: user,
            positions: positions,
          });
        });
      }
    );
  }
});

router.post("/vote/:voter/:position", upload.none(), async function (
  req,
  res,
  next
) {
  try {
    let voter = await req.params.voter;
    let position = await req.params.position;
    let candidate = await req.body.candidate;
    let values = [voter, position, candidate];
    await console.log(values);
    // Check if voter has voted for this post before
    conn.query(
      "SELECT * FROM  votes WHERE voter_id = ? AND position_id = ?",
      [voter, position],
      async function (error, results, fields) {
        try {
          // if (error) throw error;
          await console.log("Number of entries" + results.length);
          if (results.length > 0) {
            req.session.message =
              "You have already cast your vote for this position of office before";
            res.redirect("/users/home");
          } else if (results.length == 0) {
            console.log(values);
            conn.query(
              "INSERT INTO votes (voter_id, position_id, candidate_id) VALUES (?, ?, ?)",
              [voter, position, candidate],
              async function (error) {
                try {
                  if (error) throw error;
                  req.session.message =
                    "Your vote has been recorded. Results will be published at the end of the election";
                  res.redirect("/users/home");
                } catch (error) {
                  console.log(error);
                }
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.post("/apply/:id", upload.none(), async function (req, res, next) {
  try {
    let positionID = await req.body.position;
    console.log(positionID);
    let userID = await req.params.id;
    console.log(userID);
    let values = await [positionID, userID];

    // TODO
    // Perform check for previous application
    conn.query(
      "SELECT * FROM candidates WHERE user_id = ? AND is_approved = 1",
      userID,
      function (error, results, fields) {
        if (results.length > 0) {
          req.session.message =
            "You are already contesting for a post, Contact the elections officer to change your stance";
          res.redirect("users/profile");
        } else {
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
          req.session.message = "Application successful";
          res.redirect("/users/profile");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
