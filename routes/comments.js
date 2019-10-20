const express = require('express'),
  router = express.Router({mergeParams: true}),
  Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

//================
//COMMENTS ROUTES
//================

router.post('/', isLoggedIn, (req, res) => {
  //POST Comment
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.user.username = req.user.username;
          comment.user.id = req.user._id;
          comment.user.profilePic = req.user.profilePic;
          comment.save();
          recipe.comments.push(comment);
          recipe.save();
          res.redirect('/recipes/' + req.params.id + '#comment-section');
        }
      });
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
