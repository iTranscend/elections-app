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
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        console.log(results[0].role_id);
        if (results[0].role_id != 1) {
          req.session.message =
            "You are not authorized to access this resource!";
          res.redirect("/");
        } else if (results[0].role_id == 1) {
          // Execute if admin
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
                // Get
                conn.query("SELECT * FROM config WHERE id = 1", async function (
                  error,
                  config,
                  fields
                ) {
                  try {
                    console.log("electionStarted: " + config[0].value);
                    let startElection = config[0].value;
                    res.render("admin/home", {
                      title: "Elections",
                      message: req.session.message,
                      user: results[0],
                      positions,
                      startElection,
                    });
                  } catch (error) {
                    console.log(error);
                  }
                });
              });
            }
          );
        }
      }
    );
    // Get admin details
  }
});

// Route to start the election
router.post("/startElection", upload.none(), async function (req, res, next) {
  try {
    if (!req.session.email) {
      req.session.message = "You must be logged in to access this page!";
      res.redirect("/");
    } else {
      // Check if user is an Admin
      conn.query(
        "SELECT firstname, role_id FROM users WHERE email = ?",
        req.session.email,
        function (error, results, fields) {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            // Update the startElection record to true
            conn.query("UPDATE config SET value = 1 WHERE id = 1", function (
              err
            ) {
              if (err) throw err;
              req.session.message = "Election Started";
              res.redirect("/admin/home");
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

// Route to end the election
router.post("/endElection", upload.none(), async function (req, res, next) {
  try {
    if (!req.session.email) {
      req.session.message = "You must be logged in to access this page!";
      res.redirect("/");
    } else {
      // Check if user is an Admin
      conn.query(
        "SELECT firstname, role_id FROM users WHERE email = ?",
        req.session.email,
        function (error, results, fields) {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            // Update the startElection record to true
            conn.query("UPDATE config SET value = 2 WHERE id = 1", function (
              err
            ) {
              if (err) throw err;
              req.session.message = "Election Ended";
              res.redirect("/admin/home");
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/candidates", function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        console.log(results[0].role_id);
        if (results[0].role_id != 1) {
          req.session.message =
            "You are not authorized to access this resource!";
          res.redirect("/");
        } else if (results[0].role_id == 1) {
          // Execute if admin
          conn.query(
            `SELECT u.firstname AS firstname, u.lastname AS lastname, u.email AS email, c.id AS candidate_id, c.position_id AS position_id, c.is_approved AS status, p.name AS position_name 
            FROM users u
            JOIN candidates c ON u.id = c.user_id
            JOIN positions p ON c.position_id = p.id`,
            function (error, results, fields) {
              if (error) throw error;
              res.render("admin/candidates", {
                title: "Elections",
                message: req.session.message,
                candidates: results,
              });
            }
          );
        }
      }
    );
  }
});

router.post("/approve/:id", upload.none(), async function (req, res, next) {
  try {
    if (!req.session.email) {
      req.session.message = "You must be logged in to access this page!";
      res.redirect("/");
    } else {
      // Check if user is an Admin
      conn.query(
        "SELECT firstname, role_id FROM users WHERE email = ?",
        req.session.email,
        async function (error, results, fields) {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            let userID = await req.params.id;
            console.log("User: " + userID);
            conn.query(
              "SELECT * FROM candidates WHERE user_id = ? AND is_approved = 1",
              userID,
              async function (error, results, fields) {
                try {
                  console.log("Approved entries: " + results.length);
                  if (error) throw error;
                  if (results.length == 0) {
                    conn.query(
                      "UPDATE candidates SET is_approved = 1 WHERE id = ?",
                      userID,
                      function (error) {
                        if (error) throw error;
                        req.session.message = "";
                        res.redirect("/admin/candidates");
                      }
                    );
                  } else if (results.length > 0) {
                    req.session.message = await "This candidate has already been approved to run for a position";
                    res.redirect("/admin/candidates");
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/disapprove/:id", upload.none(), function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        console.log(results[0].role_id);
        if (results[0].role_id != 1) {
          req.session.message =
            "You are not authorized to access this resource!";
          res.redirect("/");
        } else if (results[0].role_id == 1) {
          // Execute if admin
          let userID = req.params.id;
          console.log(userID);

          conn.query(
            "UPDATE candidates SET is_approved = '0' WHERE id = ?",
            userID,
            function (error) {
              if (error) throw error;
              req.session.message = "";
              res.redirect("/admin/candidates");
            }
          );
        }
      }
    );
  }
});

router.post("/createPosition", upload.none(), function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        console.log(results[0].role_id);
        if (results[0].role_id != 1) {
          req.session.message =
            "You are not authorized to access this resource!";
          res.redirect("/");
        } else if (results[0].role_id == 1) {
          // Execute if admin
          let position = req.body.position;
          console.log(position);

          conn.query(
            "INSERT INTO positions(name) VALUES (?)",
            position,
            function (error) {
              if (error) throw error;
              req.session.message = "Post Created";
              res.redirect("/admin/home");
            }
          );
        }
      }
    );
  }
});

// Route to update voting deadline
router.post("/voterDeadline", upload.none(), function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      async function (error, results, fields) {
        try {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            let deadline = req.body.voterDeadline;
            conn.query(
              "UPDATE deadlines SET value = ? WHERE id = 2",
              deadline,
              function (error) {
                if (error) throw error;
                req.session.message = "Voting deadline updated";
                res.redirect("/admin/home");
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
});

// Route to update candidate application deadline
router.post("/candidateDeadline", upload.none(), function (req, res, next) {
  if (!req.session.email) {
    req.session.message = "You must be logged in to access this page!";
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      async function (error, results, fields) {
        try {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            let deadline = req.body.candidateDeadline;
            conn.query(
              "UPDATE deadlines SET value = ? WHERE id = 1",
              deadline,
              function (error) {
                if (error) throw error;
                req.session.message = "Candidate application deadline updated";
                res.redirect("/admin/home");
              }
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
});

router.get("/results", function (req, res, next) {
  if (!req.session.email) {
    res.redirect("/");
  } else {
    // Check if user is an Admin
    conn.query(
      "SELECT firstname, role_id FROM users WHERE email = ?",
      req.session.email,
      function (error, results, fields) {
        console.log(results[0].role_id);
        if (results[0].role_id != 1) {
          req.session.message =
            "You are not authorized to access this resource!";
          res.redirect("/");
        } else if (results[0].role_id == 1) {
          // Execute if admin
          conn.query(
            "SELECT id, name FROM positions ORDER BY id",
            async function (err, positions, fields) {
              let candidacy = [];
              if (err) throw err;
              await console.log("Positions:", positions);
              await positions.forEach(async (position) => {
                conn.query(
                  "SELECT u.firstname AS firstname, u.lastname AS lastname, u.profile_pic AS profile_pic, c.id AS candidate_id FROM users u JOIN candidates c ON u.id = c.user_id JOIN positions p ON p.id = c.position_id WHERE c.is_approved = 1 and p.id = ? ORDER BY p.id",
                  position.id,
                  async function (error, candidates, fields) {
                    if (error) throw error;
                    // candidacy[position.name];

                    await candidates.forEach((candidate) => {
                      console.log(candidate);
                      conn.query(
                        "SELECT COUNT(*) AS count FROM votes WHERE position_id = ? AND candidate_id = ?",
                        [position.id, candidate.candidate_id],
                        async function (error, value, fields) {
                          let voteCount = await value[0].count;
                          await console.log(
                            position.id +
                              " : " +
                              candidate.candidate_id +
                              " : " +
                              voteCount
                          );
                          candidate.votes = await voteCount;
                        }
                      );
                    });

                    // candidacy[position.name]  = candidates

                    // Formation of the compound object to be sent back to user
                    // candidacy[position.name] = candidates;
                    candidacy[position.name] = {
                      id: position.id,
                      candidates,
                    };
                  }
                );
              });
              await setTimeout(async () => {
                await console.log("Candidacy:", candidacy);
                req.session.message = "";
                return res.render("admin/results", {
                  title: "Elections",
                  message: req.session.message,
                  user: results[0],
                  candidacy,
                });
                // req.session.message = "";
              }, 3000);
            }
          );
          // req.session.message = "";
          // res.render("admin/results", {
          //   title: "Elections",
          //   message: req.session.message,
          //   candidates: results,
          // });
        }
      }
    );
  }
});

// Route to publish the election results
router.get("/publishResults", async function (req, res, next) {
  try {
    if (!req.session.email) {
      req.session.message = "You must be logged in to access this page!";
      res.redirect("/");
    } else {
      // Check if user is an Admin
      conn.query(
        "SELECT firstname, role_id FROM users WHERE email = ?",
        req.session.email,
        function (error, results, fields) {
          console.log(results[0].role_id);
          if (results[0].role_id != 1) {
            req.session.message =
              "You are not authorized to access this resource!";
            res.redirect("/");
          } else if (results[0].role_id == 1) {
            // Execute if admin
            // Update the publishResults record to true
            conn.query("UPDATE config SET value = 1 WHERE id = 2", function (
              err
            ) {
              if (err) throw err;
              req.session.message =
                "Results have been published! All other users can now access them";
              res.redirect("/admin/home");
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
