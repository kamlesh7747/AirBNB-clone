const express = require('express');
const Listing = require("../models/listing");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const asyncWrap = require('../utils/asyncWrap');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/new", isLoggedIn, (req, res) => {
    res.render("NewListingForm");
});

router.put('/:id', isLoggedIn, isOwner, upload.single("image"), validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/");
    }

    if (!(res.locals.currUser && res.locals.currUser._id.equals(listing.owner))) {
        req.flash("error", "You don't have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }

    // Update fields
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.location = req.body.location;
    listing.country = req.body.country;

    if (req.file) {
        // Delete old image from Cloudinary if it exists
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
    };
    listing.image = {
        url: req.file.path,
        filename: req.file.filename
    };

    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));


router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params; // Get ID from URL
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner"); // Fetch listing from MongoDB
    if (!listing) {
        req.flash("error", "listing does not exist!");
        return res.redirect("/");
        // return res.status(404).send("Listing not found");
    }

    res.render("Show", { listing }); // pass data and Render 

}));

// edit form
router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(async (req, res) => {

    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("EditForm", { listing });

}));
// edit
router.put('/:id', isLoggedIn, isOwner, upload.single("image"), validateListing, asyncWrap(async (req, res) => {

    let { id } = req.params;
    let editedData = req.body;
    console.log(req.file)
    let url = req.file.path;
    let filename = req.file.filename;

    let listing = await Listing.findById(id);
    listing.image = { url, filename };
    if (!(res.locals.currUser && res.locals.currUser._id.equals(listing.owner))) {
        req.flash("error", "you don't have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title: editedData.title,
        description: editedData.description,
        price: editedData.price,
        location: editedData.location,
        country: editedData.country,
        image: {
            filename: editedData.filename,
            url: editedData.imageUrl
        }
    }); // { new: true } returns the updated document

    console.log(updatedListing);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id", isLoggedIn, isOwner, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/");
}));


module.exports = router;