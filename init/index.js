const mongoose = require("mongoose");
let { initData } = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
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
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData = initData.map((listing) => ({ ...listing, owner: "6844048fdb10e5c47caec49c" }));
  await Listing.insertMany(initData);
  await Review.deleteMany({});
  // await User.deleteMany({});
  console.log("data was initialized");
};

initDB();
