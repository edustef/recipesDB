const express = require('express'),
  router = express.Router({ mergeParams: true }),
  commController = require('../controllers/commController'),
  authController = require('../controllers/authController');

//=================================
//COMMENTS ROUTES :::: recipe/:id/
//=================================

//GET COMMENT 
router.get( '/comments/:comment_id/edit', authController.commentAuth, commController.getComment);

//POST COMMENT
router.post('/comments', authController.isLoggedIn, commController.postComment);

//UPDATE COMMENT
router.put('/comments/:comment_id', commController.updateComment);

//DELETE A COMMENT
router.delete('/comments/:comment_id', authController.commentAuth, commController.deleteComment);

module.exports = router;
