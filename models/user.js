const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email: {
        type: String,
        required: true
    },
    // username default if not given
    // password default field
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);