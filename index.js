// Dependencies
const express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  bodyParser = require('body-parser'),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  mongoose = require('mongoose'),
  User = require('./models/user');

// Routes
const commentRoutes = require('./routes/comments'),
  recipeRoutes = require('./routes/recipes'),
  userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();

// Database config
const PORT = process.env.PORT || 5000;
const CONNECTION_URL =
  process.env.MONGODB_URI || 'mongodb://localhost/recipesdb';

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(err => {
    console.error(err);
  });

// Middleware config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
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

// DEFINING CURRENT USER
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.get('/', (req, res) => {
  res.redirect('recipes');
});

app.use('/recipes', recipeRoutes);
app.use('/recipes/:id', commentRoutes);
app.use(userRoutes);

app.listen(PORT || 5000, () => {
  console.log('Server is running!');
});
