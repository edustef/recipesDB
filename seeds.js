const yt = require('./yt'),
  Recipe = require('./models/recipe'),
  Comment = require('./models/comment');

const seeds = async recipe => {
  if (recipe.ytURL) {
    let id = yt.findId(recipe.ytURL);
    videoData = await yt.getVideoData(id);
    comments = (await yt.getComments(id)).items;

    recipe = await Recipe.create({
      name: videoData.title,
      desc: videoData.description,
      image: videoData.thumbnails.medium.url,
      article: recipe.ytURL,
      ytId: id,
      user: recipe.user
    });
    for (let i = 0; i < comments.length; i++) {
      comment = await Comment.create({
        user: {
          id: undefined,
          username:
            comments[i].snippet.topLevelComment.snippet.authorDisplayName,
          profilePic:
            comments[i].snippet.topLevelComment.snippet.authorProfileImageUrl
        },
        text: comments[i].snippet.topLevelComment.snippet.textDisplay,
        isYoutube: true
      });
      recipe.comments.push(comment);
    }
    recipe.save();
  } else {
    if (recipe.image == '') {
      recipe.image = undefined;
    }

    Recipe.create(recipe);
  }
};

module.exports = seeds;
