const Fuse = require('fuse.js'),
  Recipe = require('../models/recipe'),
  Comment = require('../models/recipe'),
  Seeds = require('../seeds');

// GET RECIPES
module.exports.getRecipes = (req, res) => {
  if (Object.entries(req.query).length === 0) {
    Recipe.find({}, (err, recipes) => {
      if (err) {
        console.error(err);
      } else {
        res.render('index', { recipes: recipes, search_query: undefined });
      }
    });
  } else {
    Recipe.find({}, (err, recipes) => {
      if (err) {
        console.error(err);
      } else {
        var options = {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['name']
        };
        var fuse = new Fuse(recipes, options); // "list" is the item array
        var results = fuse.search(req.query.query);
        res.render('index', {
          recipes: results,
          search_query: req.query.query
        });
      }
    });
  }
}

// POST RECIPE
module.exports.postRecipe = async (req, res) => {
  user = {
    id: req.user._id,
    username: req.user.username
  };

  body = req.body.recipe;
  body.user = user;

  console.log(body);
  await Seeds(body);
  res.redirect('/recipes');
}

// GET RECIPE
module.exports.getRecipe = (req, res) => {
  Recipe.findById(req.params.id)
    .populate('comments')
    .exec((err, recipe) => {
      if (err) {
        req.flash('error', 'Recipe not found!');
        res.redirect('/recipes');
      } else {
        res.render('recipes/show', { recipe: recipe });
      }
    });
}

// GET UPDATE RECIPE
module.exports.getUpdateRecipe =  (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      req.flash('error', 'Recipe not found!');
      res.redirect('/recipes');
    } else {
      res.render('recipes/edit', { recipe: recipe });
    }
  });
}

// UPDATE RECIPE
module.exports.updateRecipe = (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, recipe) => {
    if (err) {
      req.flash('error', 'Recipe not found!');
      res.redirect('/recipes');
    } else {
      res.redirect('/recipes/' + req.params.id);
    }
  });
}

// DELETE RECIPE
module.exports.deleteRecipe = (req, res) => {
  //Delete post and  it's comments from db
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err) {
      req.flash('error', 'Recipe not found!');
      res.redirect('/recipes');
    } else {
      for (let i = 0; i < recipe.comments.length; i++) {
        Comment.findByIdAndRemove(recipe.comments[i]._id, err => {
          if (err) {
            req.flash('error', 'Comment not found!');
            res.redirect('/recipes');
          }
        });
      }
    }
    res.redirect('/recipes');
  });
}

