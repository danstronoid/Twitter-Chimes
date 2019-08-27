require('dotenv').config();
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


async () => {
    try {
        client.get('application/rate_limit_status')
            .then(response => {
                console.log("response", response);
            });
            
        } catch (e) {
        if ('errors' in e) {
            console.log(e);
            // Twitter API error
            if (e.errors[0].code === 88)
            // rate limit exceeded
            console.log("Rate limit will reset on", new Date(e._headers["x-rate-limit-reset"] * 1000));
        }
    }
}
