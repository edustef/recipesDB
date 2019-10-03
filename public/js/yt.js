fetch = require('node-fetch');

module.exports.getVideoData = async function(ytId) {
  const key = process.env.API_KEY;
  const url =
    'https://www.googleapis.com/youtube/v3/videos?id=' +
    ytId +
    '&key=' +
    key +
    '&part=snippet';
  const response = await fetch(url);
  const commits = await response.json();
  console.log(commits);
  return await commits.items[0].snippet;
};

module.exports.findId = function(ytURL) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = ytURL.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    console.log('There was an error!');
  }
};

module.exports.getComments = async function(ytId) {
  const key = process.env.API_KEY;
  const url =
    'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=10&order=relevance&textFormat=plainText&videoId=' +
    ytId +
    '&key=' +
    key;
  const response = await fetch(url);
  const commits = await response.json();
  return await commits;
};
