const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("RegisterPage");
});

router.post("/", async (req, res, next) => {
  const db = req.db;
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.render("RegisterPage", { error: "Please fill in every field." });
  }

  try {
    const existing = await new Promise((resolve, reject) => {
      db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (existing) {
      return res.render("RegisterPage", { error: "Email already registered." });
    }

    const hash = await bcrypt.hash(password, 10);
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        [email, username, hash],
        err => (err ? reject(err) : resolve())
      );
    });

    return res.redirect("/login");
  } catch (err) {
    return next(err);
  }
});

module.exports = router;