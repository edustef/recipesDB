const express = require('express'),
  router = express.Router(),
  Recipe = require('../models/recipe'),
  Comment = require('../models/recipe'),
  Seeds = require('../seeds'),
  Middleware = require('../middleware');

//=============================
//RECIPES ROUTES :::: /recipes
//=============================

//HOME ROUTE
router.get('/', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) {
      console.error(err);
    } else {
      res.render('index', { recipes: recipes });
    }
  });
});

// POSTING A RECIPE
router.post('/', Middleware.isLoggedIn, async (req, res) => {
  user = {
    id: req.user._id,
    username: req.user.username
  };

  body = req.body.recipe;
  body.user = user;

  await Seeds(body);
  res.redirect('/recipes');
});

//NEW PAGE FOR RECIPE CREATION
router.get('/new', Middleware.isLoggedIn, (req, res) => {
  res.render('recipes/new');
});

//SHOW RECIPE PAGE
router.get('/:id', (req, res) => {
  Recipe.findById(req.params.id)
    .populate('comments')
    .exec((err, recipe) => {
      if (err) {
        console.log('Failed to fetch id!');
      } else {
        res.render('recipes/show', { recipe: recipe });
      }
    });
});

//EDIT RECIPE PAGE
router.get('/:id/edit', Middleware.auth, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      res.redirect('/recipes');
    } else {
      res.render('recipes/edit', { recipe: recipe });
    }
  });
});

//UPDATE RECIPE
router.put('/:id', Middleware.auth, (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, recipe) => {
    if (err) {
      res.redirect('/recipes');
    } else {
      res.redirect('/recipes/' + req.params.id);
    }
  });
});

//DELETE RECIPE
router.delete('/:id', Middleware.auth, (req, res) => {
  //Delete post and  it's comments from db
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < recipe.comments.length; i++) {
        Comment.findByIdAndRemove(recipe.comments[i]._id, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
    res.redirect('/recipes');
  });
});

module.exports = router;
