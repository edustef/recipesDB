const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  fetch = require('node-fetch');
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost/recipesdb', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//#region Schema Setup
const recipeSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: String,
  article: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

//#endregion Schema Setup

//#region recipes arr
// const recipes = [
//   {
//     name: 'Salmon Creek',
//     image:
//       'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: 'Granite Hill',
//     image:
//       'https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image:
//       'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: 'Salmon Creek',
//     image:
//       'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: 'Granite Hill',
//     image:
//       'https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image:
//       'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: 'Salmon Creek',
//     image:
//       'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: 'Granite Hill',
//     image:
//       'https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   },
//   {
//     name: "Mountain Goat's Rest",
//     image:
//       'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
//   }
// ];
//#endregion

//#region Routes

app.get('/', (req, res) => {
  res.render('landing');
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
    let id = findID(req.body.ytURL);
    getYtInfo(id)
      .then(data => {
        Recipe.create(
          {
            name: data.title,
            desc: data.description,
            image: data.thumbnails.standard.url,
            article: req.body.ytURL
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

app.listen(5000, () => {
  console.log('Listening on port 5000');
});

async function getYtInfo(ytId) {
  const key = process.env.API_KEY;
  const url =
    'https://www.googleapis.com/youtube/v3/videos?id=' +
    ytId +
    '&key=' +
    key +
    '&part=snippet';
  const response = await fetch(url);
  const commits = await response.json();
  return await commits.items[0].snippet;
}

function findID(ytURL) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = ytURL.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    console.log('There was an error!');
  }
}
//#endregion Routes
