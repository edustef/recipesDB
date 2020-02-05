const Recipe = require('../models/recipe'),
  Comment = require('../models/comment');

// GET COMMENT
module.exports.getComment = (req, res) => {
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
}

//POST COMMENT
module.exports.postComment = (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
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
}

// UPDATE COMMENT
module.exports.updateComment = (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        console.log(err);
      } else {
        req.flash('success', 'Comment updated successfully!');
        res.redirect('/recipes/' + req.params.id);
      }
    }
  );
}

//DELETE A COMMENT
module.exports.deleteComment = (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      console.log(err);
    } else {
      req.flash('success', 'Comment deleted successfully!');
      res.redirect('/recipes/' + req.params.id);
    }
  });
}
