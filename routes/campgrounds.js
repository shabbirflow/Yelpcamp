const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/MyError");
const Campground = require("../models/campground");
const campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isOwner } = require("../middleware.js");

router.get(
  "/",
  catchAsync(async (req, res) => {
    // console.log("heh", req.isAuthenticated());
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
  })
);

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new MyError("Please enter some data", 400);
    const idk = req.body;
    const camp = new Campground(req.body.campground);
    camp.owner = req.user._id;
    console.log(camp);
    await camp.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: "owner",
      })
      .populate("owner");
    // console.dir(foundCamp);
    // console.log(foundCamp);
    if (!foundCamp) {
      // throw new MyError("Did not find a campground with this ID", 404);
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    // console.log(foundCamp);
    res.render("campgrounds/show", { foundCamp });
    // res.send("THIS WILL BE THE SHOW PAGE ONE DAY");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
      // throw new MyError("Did not find a campground with this ID", 404);
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    // console.log(foundCamp);
    res.render("campgrounds/edit", { foundCamp });
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    return res.redirect("/campgrounds");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCamp = req.body.campground;
    // console.log(newCamp);
    await Campground.findByIdAndUpdate(id, newCamp, { runValidators: true });
    req.flash("success", "Successfully updated campground");
    return res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
