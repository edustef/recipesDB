const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorDisplayName: String,
  authorProfileImageUrl: String,
  text: String
});

module.exports = mongoose.model('Comment', commentSchema);
