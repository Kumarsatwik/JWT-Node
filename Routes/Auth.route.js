const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/auth_controller");

// Register
router.post("/register", AuthController.register);

//  Login
router.post("/login", AuthController.login);

// refresh Token
router.post("/refresh-token", AuthController.refreshToken);

// Logout the user
router.delete("/logout", AuthController.logout);

module.exports = router;
