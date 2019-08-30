const express = require('express');
const router = express.Router();

// the home directory
router.get('/', (req, res) => {
    // change this eventually
    let keyword = "Wind";
    let phrase = "Start the stream...";
    res.render('index.html', {keyword: keyword, phrase: phrase});
});

// start the twitter stream based on search
router.get('/stream', (req, res) => {
    // change this eventually
    let keyword = "Wind";
    let phrase = "Listen to the breeze...";
    res.render('stream.html', {keyword: keyword, phrase: phrase});
});

// stop the twitter stream and return to index
router.get('/stop', (req, res) => {
    process.nextTick(() => res.redirect('/'));
});

module.exports = router;