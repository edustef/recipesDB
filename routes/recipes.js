const express = require('express'),
  router = express.Router(),
  authController = require('../controllers/authController'),
  recipeController = require('../controllers/recipeController');

//=============================
//RECIPES ROUTES :::: /recipes
//=============================

// HOME ROUTE
router.get('/', recipeController.getRecipes);

// POSTING A RECIPE
router.post('/', authController.isLoggedIn, recipeController.postRecipe);

//NEW PAGE FOR RECIPE CREATION
router.get('/new', authController.isLoggedIn, (req, res) => {
  res.render('recipes/new');
});

//SHOW RECIPE PAGE
router.get('/:id', recipeController.getRecipe);

//EDIT RECIPE PAGE
router.get('/:id/edit', authController.auth, recipeController.getUpdateRecipe);

//UPDATE RECIPE
router.put('/:id', authController.auth, recipeController.updateRecipe);

//DELETE RECIPE
router.delete('/:id', authController.auth, recipeController.deleteRecipe);

module.exports = router;
