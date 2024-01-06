const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/MyError");
const Campground = require("../models/campground");
const campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

router.post(
  "/", isLoggedIn,
  catchAsync(async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    const review = new Review(body.review);
    review.owner = req.user._id;
    foundCamp.reviews.push(review);
    await review.save();
    await foundCamp.save();
    req.flash("success", "Successfully posted review");
    res.redirect(`/campgrounds/${id}`);
    // res.send(body);
  })
);

router.delete(
  "/:reviewId", isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //deleting review with specific review id from the campground reviews array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
