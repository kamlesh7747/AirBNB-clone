const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    title: String,
    description:
        String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;