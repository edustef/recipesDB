const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  profilePic: String,
  text: String,
  isYoutube: { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', commentSchema);
