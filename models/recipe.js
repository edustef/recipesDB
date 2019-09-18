const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: String,
  article: String,
  ytId: String
});

module.exports = mongoose.model('Recipe', recipeSchema);
