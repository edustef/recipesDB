const express = require('express'),
  router = express.Router(),
  recipeController = require('../controllers/recipeController');

//=============================
//RECIPES ROUTES :::: /recipes
//=============================

// HOME ROUTE
router.get('/', recipeController.getRecipes);

// POSTING A RECIPE
router.post('/', Middleware.isLoggedIn, recipeController.postRecipe);

//NEW PAGE FOR RECIPE CREATION
router.get('/new', Middleware.isLoggedIn, (req, res) => {
  res.render('recipes/new');
});

//SHOW RECIPE PAGE
router.get('/:id', recipeController.getRecipe);

//EDIT RECIPE PAGE
router.get('/:id/edit', Middleware.auth, recipeController.getUpdateRecipe);

//UPDATE RECIPE
router.put('/:id', Middleware.auth, recipeController.updateRecipe);

//DELETE RECIPE
router.delete('/:id', Middleware.auth, recipeController.deleteRecipe);

module.exports = router;
