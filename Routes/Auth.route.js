const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError.BadRequest();
    }

    const doesExist = await User.findOne({ email: email });
    if (doesExist) throw createError.Conflict(`${email} already exists`);

    const user = new User({ email, password });
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  res.send("login Route");
});

router.post("/refresh-token", async (req, res, next) => {
  res.send("Refresh token Route");
});

router.delete("/logout", async (req, res, next) => {
  res.send("logout Route");
});

module.exports = router;
