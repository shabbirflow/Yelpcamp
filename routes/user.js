const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    // console.log("YOU HIT ME");
    // res.send(req.body);
    try {
      const { email, username, password } = req.body; //register user & log them in with passport
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true, //middleware for auth
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    // const redirectUrl = req.session.returnTo || "/campgrounds";
    // delete req.session.returnTo;
    console.log('log', req.isAuthenticated());
    // res.redirect(redirectUrl);
    res.redirect('/campgrounds')
  }
);

// router.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success", "Goodbye!");
//   res.redirect("/campgrounds");
// });

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/campgrounds');
  });
}); 

module.exports = router;
