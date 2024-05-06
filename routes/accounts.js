const express = require("express");
const router = express.Router();

const { getHashed, compareHash } = require("./hashing");

router.get("/logout", async (req, res) => {
  try {
    req.session.user = undefined;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error logging out");
  }
});

router.get("/login", async (req, res) => {
  try {
    res.render("login", { hide_login: true });
  } catch (error) {
    res.status(500).send("Error rendering login page");
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const p1 = req.body.password.trim();
    const user = await req.db.findUserByUserName(username);
    if (user && compareHash(p1, user.password)) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.render("login", {
        hide_login: true,
        message: "Could not authenticate",
      });
    }
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

router.get("/signup", async (req, res) => {
  try {
    res.render("signup", { hide_login: true });
  } catch (error) {
    res.status(500).send("Error rendering signup page");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username.trim();
    const first_name = req.body.firstname.trim();
    const last_name = req.body.lastname.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    if (p1 != p2) {
      res.render("signup", {
        hide_login: true,
        message: "Passwords do not match!",
      });
      return;
    }

    const user = await req.db.findUserByUserName(username);
    if (user) {
      res.render("signup", {
        hide_login: true,
        message: "An account with this username already exists!",
      });
      return;
    }

    const hash = getHashed(p1);

    const id = await req.db.createUser(first_name, last_name, username, hash);
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error signing up");
  }
});

module.exports = router;
