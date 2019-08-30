const twitterStream = require('../models/twitter-stream.js');

// error-handler middleware for a stream error
module.exports = function (req, res, next) {
    if (!twitterStream.alive()) {
        console.error("dead stream");
        res.status(500).render('error.html');
    } else {
        next();
    }
}