const mongoose = require('mongoose'),
  yt = require('./yt'),
  Recipe = require('../../models/recipe'),
  Comment = require('../../models/comment');

const seeds = async body => {
  if (body.ytURL) {
    let id = yt.findId(body.ytURL);
    videoData = await yt.getVideoData(id);
    comments = (await yt.getComments(id)).items;

    recipe = await Recipe.create({
      name: videoData.title,
      desc: videoData.description,
      image: videoData.thumbnails.medium.url,
      article: body.ytURL,
      ytId: id
    });
    for (let i = 0; i < comments.length; i++) {
      comment = await Comment.create({
        user: {
          username:
            comments[i].snippet.topLevelComment.snippet.authorDisplayName
        },
        profilePic:
          comments[i].snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: comments[i].snippet.topLevelComment.snippet.textDisplay,
        isYoutube: true
      });
      recipe.comments.push(comment);
    }
    recipe.save();
  } else {
    if (body.recipe.image == '') {
      body.recipe.image = undefined;
    }

    Recipe.create(body.recipe);
  }
};

module.exports = seeds;
