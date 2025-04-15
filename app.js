const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const multer = require("multer");

const { storage } = require("./cloudinaryConfig")
const upload = multer({ storage: storage });

const MONGO_URL = "mongodb://localhost:27017/wanderLust";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("database is now connected.")
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));  // to parse form data, extended: true allows nesting in data

app.engine("ejs", ejsMate);

app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const data = await Listing.find({});
    res.render('index', { data });
});
app.get("/listings/new", (req, res) => {
    res.render("NewListingForm");
})
app.post("/listings/new", upload.single("image"), async (req, res) => {
    const jsonData = req.body;
    const imageData = req.file;

    const newListing = new Listing({
        title: jsonData.title,
        description: jsonData.description,
        image: {
            filename: imageData.filename,
            url: imageData.path
        },
        price: jsonData.price,
        location: jsonData.location,
        country: jsonData.country
    });

    await newListing.save();
    console.log(newListing);

    res.redirect("/");
});


app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL
        const listing = await Listing.findById(id); // Fetch listing from MongoDB
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("Show", { listing }); // pass data and Render 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("EditForm", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.put('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const editedData = req.body;

        // Update listing with new data
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
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating listing");
    }
});

app.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/");
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
