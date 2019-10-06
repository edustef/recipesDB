const express = require('express'),
  router = express.Router(),
  Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

//================
//COMMENTS ROUTES
//================

router.post('/recipes/:id', isLoggedIn, (req, res) => {
  //POST Comment
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          recipe.comments.push(comment);
          recipe.save();
          res.redirect('/recipes/' + req.params.id + '#comment-section');
        }
      });
    }
  });
});

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
