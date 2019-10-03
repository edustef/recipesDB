const express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  Recipe = require('./models/recipe'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seeds = require('./public/js/seeds');
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost/recipesdb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'This is a recipe site you know',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.post('/recipes', async (req, res) => {
  await seeds(req.body);
  res.redirect('/recipes');
});

app.get('/recipes/new', (req, res) => {
  res.render('new');
});

app.get('/recipes/:id', (req, res) => {
  Recipe.findById(req.params.id)
    .populate('comments')
    .exec((err, recipe) => {
      if (err) {
        console.log('Failed to fetch id!');
      } else {
        res.render('show', { recipe: recipe });
      }
    });
});

app.post('/recipes/:id', (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          recipe.comments.push(comment);
          recipe.save();
          res.redirect('/recipes/' + req.params.id + '#comment-section');
        }
      });
    }
  });
});

app.delete('/recipes/:id', (req, res) => {
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < recipe.comments.length; i++) {
        Comment.findByIdAndRemove(recipe.comments[i]._id, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
    res.redirect('/recipes');
  });
});

//AUTH ROUTES

app.get('/register', (req, res) => {
  res.render('register');
});
app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/recipes');
    });
  });
});

//#endregion Routes

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
