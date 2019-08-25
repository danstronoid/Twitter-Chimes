const Twitter = require('twitter-lite/twitter');
const Stream = require('twitter-lite/stream');

// add environ variables for safety
let client = new Twitter({
    subdomain: "api",
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* client.get("account/verify_credentials")
    .then(results => {
        console.log(results);
    })
    .catch(console.error); */

module.exports = client;