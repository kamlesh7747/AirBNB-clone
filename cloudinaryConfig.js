
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// Important : not in docs
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// this is similar to wrapping
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderLust',
        allowedFormats: ["jpg", "jpeg", "png"]
    },
});
// not in docs
module.exports = { storage, cloudinary };