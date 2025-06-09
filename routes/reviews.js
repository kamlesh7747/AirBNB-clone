const express = require('express');
const Listing = require("../models/listing");
const Review = require("../models/review");
const asyncWrap = require('../utils/asyncWrap');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const router = express.Router({ mergeParams: true });

// add review route 
router.post("/new", isLoggedIn, validateReview, asyncWrap(async (req, res) => {
    const newReview = req.body.review;
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    const review = Review(newReview);
    review.listingId = listing.id;
    review.author = req.user._id
    listing.reviews.push(review);   // this can and will automatically extract id_ and save it.

    console.log(review);
    await review.save();
    await listing.save();
    console.log("review added successfully");

    res.redirect(`/listings/${id}`);
}));

// delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, asyncWrap(async (req, res, next) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted!")
    res.redirect(`/listings/${id}`); // Redirect back to the listing page
}));

module.exports = router;