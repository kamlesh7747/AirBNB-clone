const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: {
        type: String,
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing" // common mistake : no need to require
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// post delete mongoose middleware
// reviewSchema.post("findOneAndDelete",)

// Create a collection
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
