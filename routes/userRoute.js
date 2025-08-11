const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.Signup));

// login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.Login);

// logout
router.get("/logout",userController.Logout);


module.exports = router;