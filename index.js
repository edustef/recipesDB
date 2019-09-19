const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Recipe = require('./models/recipe'),
  User = require('./models/user'),
  seeds = require('./public/js/seeds');
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost/recipesdb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//#region Routes

app.get('/', (req, res) => {
  res.redirect('recipes');
});

app.get('/recipes', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) {
      console.error('No recipes found');
    } else {
      res.render('index', { recipes: recipes });
    }
  });
});

app.post('/recipes', (req, res) => {
  seeds(req.body);
  res.redirect('/recipes');
});

app.get('/recipes/new', (req, res) => {
  res.render('new');
});

app.get('/recipes/:id', (req, res) => {
  Recipe.findById(req.params.id, (err, foundRecipe) => {
    if (err) {
      console.log('Failed to fetch id!');
    } else {
      res.render('show', { recipe: foundRecipe });
    }
  });
});
//#endregion Routes

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
