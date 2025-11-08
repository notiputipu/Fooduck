const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("LoginPage");
});

router.post("/", (req, res, next) => {
  const db = req.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("LoginPage", { error: "Please fill in both fields." });
  }

  db.get(
    "SELECT id, username, password_hash FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.render("LoginPage", { error: "Invalid credentials." });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.render("LoginPage", { error: "Invalid credentials." });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      return res.redirect("/home");
    }
  );
});

module.exports = router;