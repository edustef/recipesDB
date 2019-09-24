const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorDisplayName: { type: String, default: 'Anon' },
  authorProfileImageUrl: String,
  text: String,
  isYoutube: { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', commentSchema);
