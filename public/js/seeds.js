const mongoose = require('mongoose'),
  yt = require('./yt'),
  Recipe = require('../../models/recipe'),
  Comment = require('../../models/comment');

async function seeds(body) {
  if (body.ytURL) {
    let id = yt.findId(body.ytURL);
    videoData = await yt.getVideoData(id);
    comments = await yt.getComments(id);

    recipe = await Recipe.create({
      name: videoData.title,
      desc: videoData.description,
      image: videoData.thumbnails.standard.url,
      article: body.ytURL,
      ytId: id
    });
    comments.forEach(comment => {
      comment = await Comment.create({
        authorDisplayName:
          comments.items[0].snippet.topLevelComment.snippet.authorDisplayName,
        authorProfileImageUrl:
          comments.items[0].snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: comments.items[0].snippet.topLevelComment.snippet.textDisplay,
        likes: comments.items[0].snippet.topLevelComment.snippet.likes
      });
      recipe.comments.push(comment);
    });
  } else {
    Recipe.create(body.recipe, (err, recipe) => {
      if (err) {
        console.log('Failed to create a card!');
      }
    });
  }
}

module.exports = seeds;
