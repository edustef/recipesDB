const mongoose = require('mongoose'),
  yt = require('./yt'),
  Recipe = require('../../models/recipe'),
  Comment = require('../../models/comment');

function seeds(body) {
  if (body.ytURL) {
    let id = yt.findId(body.ytURL);

    yt.getVideoData(id)
      .then(data => {
        Recipe.create(
          {
            name: data.title,
            desc: data.description,
            image: data.thumbnails.standard.url,
            article: body.ytURL,
            ytId: id
          },
          (err, recipe) => {
            if (err) {
              console.error(err);
            } else {
              yt.getComments(id)
                .then(data => {
                  Comment.create(
                    {
                      authorDisplayName:
                        data.items[0].snippet.topLevelComment.snippet
                          .authorDisplayName,
                      authorProfileImageUrl:
                        data.items[0].snippet.topLevelComment.snippet
                          .authorProfileImageUrl,
                      text:
                        data.items[0].snippet.topLevelComment.snippet
                          .textDisplay,
                      likes: data.items[0].snippet.topLevelComment.snippet.likes
                    },
                    (err, comment) => {
                      if (err) {
                        console.log(err);
                      } else {
                        recipe.comments.push(comment);
                      }
                    }
                  );
                })
                .catch(err => console.log(err));
            }
          }
        );
      })
      .catch(err => console.log(err));
  } else {
    Recipe.create(body.recipe, (err, recipe) => {
      if (err) {
        console.log('Failed to create a card!');
      }
    });
  }
}

module.exports = seeds;
