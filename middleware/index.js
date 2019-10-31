const Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

//=====================
//CHECK AUTH AND LOGIN
//=====================

module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that!');
  res.redirect('/login');
};

module.exports.auth = function(req, res, next) {
  if (req.isAuthenticated()) {
    Recipe.findById(req.params.id, (err, recipe) => {
      if (err) {
        res.redirect('back');
      } else {
        if (recipe.user.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

module.exports.commentAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        if (comment.user.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};
