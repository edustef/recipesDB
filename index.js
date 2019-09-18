const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  yt = require('./public/js/yt'),
  Recipe = require('./models/recipe'),
  User = require('./models/user'),
  Comment = require('./models/comment');
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
  if (req.body.ytURL) {
    let id = yt.findId(req.body.ytURL);
    yt.getComments(id)
      .then(data => {
        Comment.create = {
          text: data.items[0].snippet.snippet.textDisplay,
          likes: data.items[0].snippet.snippet.likes,
          authorDisplayName: data.items[0].snippet.snippet.authorDisplayName,
          authorProfileImageUrl:
            data.items[0].snippet.snippet.authorProfileImageUrl
        };
      })
      .catch(err => console.log(err));
    yt.getVideoData(id)
      .then(data => {
        Recipe.create(
          {
            name: data.title,
            desc: data.description,
            image: data.thumbnails.standard.url,
            article: req.body.ytURL,
            ytId: id
          },
          (err, recipe) => {
            if (err) {
              console.error(err);
            } else {
              res.redirect('/recipes');
            }
          }
        );
      })
      .catch(err => console.log(err));
  } else {
    Recipe.create(
      {
        name: req.body.name,
        desc: req.body.desc,
        image: req.body.image,
        article: req.body.article
      },
      (err, recipe) => {
        if (err) {
          console.log('Failed to create a card!');
        } else {
          res.redirect('/recipes');
        }
      }
    );
  }
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
