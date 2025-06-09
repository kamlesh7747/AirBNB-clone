const express = require('express');
const passport = require("passport");
const User = require("../models/user");
const asyncWrap = require('../utils/asyncWrap');
const { saveRedirectUrl } = require('../middleware');
const router = express.Router();

router.get("/signUp", (req, res) => {
    res.render("SignUpForm.ejs");
});

router.post("/signUp", asyncWrap(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Signed up successfully, Welcome to AirBNB!");
            res.redirect("/");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/user/signUp");
    }
}));

router.get("/logIn", (req, res) => {
    res.render("logInForm.ejs")
});

// passpport docs
router.post("/logIn", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/user/logIn', failureFlash: true }), async (req, res) => {
    console.log("you are logged in");
    req.flash("success", "welcome to wonderlust, you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
});

// no docs
router.get("/logOut", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/");
    });
});

module.exports = router;