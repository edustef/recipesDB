const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

//=================================
//COMMENTS ROUTES :::: recipe/:id/
//=================================

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

router.get('/comments/:comment_id/edit', checkCommentAuth, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/edit', {
        comment: comment,
        recipe_id: req.params.id
      });
    }
  });
});

router.put('/comments/:comment_id', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/recipes/' + req.params.id);
      }
    }
  );
});

router.delete('/comments/:comment_id', checkCommentAuth, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err);
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

function checkCommentAuth(req, res, next) {
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
}

module.exports = router;
