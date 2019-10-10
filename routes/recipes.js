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
  user = {
    id: req.user._id,
    username: req.user.username
  }

  body = req.body.recipe;
  body.user = user;
  console.log(body);

  await seeds(body);
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

router.get('/recipes/:id/edit', (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      res.redirect('/recipes');
    } else {
      res.render("recipes/edit", { recipe: recipe });
    }
  });
});

router.put('/recipes/:id', (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, recipe) => {
    if(err) {
      res.redirect('/recipes');
    } else {
      res.redirect('/recipes/' + req.params.id);
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.delete('/recipes/:id', isLoggedIn, (req, res) => {
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
