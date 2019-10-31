const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Recipe = require('../models/recipe'),
  Comment = require('../models/comment'),
  Middleware = require('../middleware');

//=================================
//COMMENTS ROUTES :::: recipe/:id/
//=================================

//POST COMMENT
router.post('/', Middleware.isLoggedIn, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong!');
        } else {
          comment.user.username = req.user.username;
          comment.user.id = req.user._id;
          comment.user.profilePic = req.user.profilePic;
          comment.save();
          recipe.comments.push(comment);
          recipe.save();
          req.flash('success', 'Successfully added comment!');
          res.redirect('/recipes/' + req.params.id + '#comment-section');
        }
      });
    }
  });
});

//DISPLAY COMMENT EDIT
router.get('/comments/:comment_id/edit', Middleware.commentAuth, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
    } else {
      res.render('comments/edit', {
        comment: comment,
        recipe_id: req.params.id
      });
    }
  });
});

//UPDATE COMMENT
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

//DELETE A COMMENT
router.delete('/comments/:comment_id', Middleware.commentAuth, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/recipes/' + req.params.id);
    }
  });
});

module.exports = router;
