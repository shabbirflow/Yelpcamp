const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require('dotenv').config();
// const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const MyError = require("./utils/MyError");
// const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/user");
const dbURL = process.env.MONGODB_URL;

main()
  .then(() => {
    console.log("WE ARE CONNECTED!");
  })
  .catch((error) => {
    console.log("Some ERROR!!");
    console.log(error);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const sessionConfig = {
  secret: "thisismysecretshabbir",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
  // res.render("home");
});

// app.all("*", (req, res, next) => {
//   next(new MyError("Page Not Found", 404));
// });

app.use((err, req, res, next) => {
  const { status = 500, message = "HAHAHA DEFAULT ERROR MSG" } = err;
  console.log(err);
  res.status(status).render("error", { err });
});

app.listen(3069, () => {
  console.log("Listening on PORT 3069!");
});
