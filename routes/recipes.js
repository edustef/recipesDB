const express = require('express'),
  router = express.Router(),
  Recipe = require('../models/recipe'),
  seeds = require('../public/js/seeds');

//================
//RECIPES ROUTES
//================

router.get('/', (req, res) => {
  res.redirect('recipes');
});

router.get('/recipes', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) {
      console.error('No recipes found');
    } else {
      res.render('index', { recipes: recipes });
    }
  });
});

router.post('/recipes', isLoggedIn, async (req, res) => {
  await seeds(req.body);
  res.redirect('/recipes');
});

router.get('/recipes/new', isLoggedIn, (req, res) => {
  res.render('recipes/new');
});

router.get('/recipes/:id', (req, res) => {
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
