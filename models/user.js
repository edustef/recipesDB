const mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose'),
  UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    profilePic: {
      type: String,
      default:
        'https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png'
    }
  });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
