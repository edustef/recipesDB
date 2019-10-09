const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: { type: String, default: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
  article: String,
  ytId: String,
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Recipe', recipeSchema);
