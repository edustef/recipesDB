const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user');

//======================
//AUTHENTICATION ROUTES
//======================

router.get('/register', (req, res) => {
  res.render('user/register');
});
router.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render('user/register');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/recipes');
      });
    }
  );
});

router.get('/login', (req, res) => {
  res.render('user/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/recipes',
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.send('logged in');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/recipes');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
