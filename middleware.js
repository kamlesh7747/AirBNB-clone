const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const asyncWrap = require("./utils/asyncWrap");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'GET') {
            req.session.redirectUrl = req.originalUrl;
        } else {
            if (req.params.id) {
                req.session.redirectUrl = `/listings/${req.params.id}`;
            } else {
                req.session.redirectUrl = '/';
            }
        }
        req.flash("error", "you need to log in first");
        return res.redirect("/user/logIn");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // clear it after use
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("curr user ID:", res.locals.currUser._id, typeof res.locals.currUser._id);
    console.log("listing owner:", listing.owner, typeof listing.owner);

    // console.log("curr user :", res.locals.currUser._id);
    // console.log("listing owner", listing.owner);
    if (listing.owner.toString() !== res.locals.currUser._id.toString()) {
        req.flash("error", "You don't have permission to perform this action.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}; // use before new creation and update

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = asyncWrap(async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you have not created this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
})