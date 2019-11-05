const Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

//=====================
//CHECK AUTH AND LOGIN
//=====================

module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('/login');
  }
};

module.exports.auth = function(req, res, next) {
  if (req.isAuthenticated()) {
    Recipe.findById(req.params.id, (err, recipe) => {
      if (err) {
        req.flash('error', 'Recipe not found!');
        res.redirect('back');
      } else {
        if (recipe.user.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'Permission Denied!');
          res.redirect('/recipes/' + req.params.id);
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('/recipes/' + req.params.id);
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
          req.flash('error', 'Permission Denied!');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect('back');
  }
};
