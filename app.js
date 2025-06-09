const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const flash = require("connect-flash");
const listings = require("./routes/listings");
const reviews = require("./routes/reviews");
const user = require("./routes/user");
const ExpressError = require('./utils/ExpressError');
const asyncWrap = require('./utils/asyncWrap');

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

// --- Session Setup ---
app.use(session({
    secret: 'thisisasecretkey', // should be in .env for real projects
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3, //  ms*s*min*h*d  //it specifies exact date and time.
        maxAge: 1000 * 60 * 60 * 24 * 3, //  it specifies duration
        httpOnly: true
    }
}));

// --- Passport Setup ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // to use static method
// add and remove user data from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// place before route mw
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");  // this need to be before route so that success can be stored before use
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  // to show login+signup or logOut
    next();
});

app.get('/', asyncWrap(async (req, res) => {
    const data = await Listing.find({});
    res.render('index', { data });
}));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/user", user);


// if no path is matched
app.all(/(.*)/, (req, res, next) => {
    // res.status(404).send("page not found.");
    next(new ExpressError(404, "page not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
    let { code = 500, message = "something went wrong" } = err;
    // res.status(code).send(message);
    console.log("code :", code)
    res.status(code).render("Error.ejs", { err });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

