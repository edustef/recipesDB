const express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  User = require('./models/user');

const commentRoutes = require('./routes/comments'),
  recipeRoutes = require('./routes/recipes'),
  authRoutes = require('./routes/auth');

require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost/recipesdb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'This is a recipe site you know',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.redirect('recipes');
});

app.use('/recipes', recipeRoutes);
app.use('/recipes/:id', commentRoutes);
app.use(authRoutes);

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
