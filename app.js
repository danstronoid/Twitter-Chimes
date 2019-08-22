require('dotenv').config();

// set up express and requirements
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const path  = require('path');
const port = process.env.PORT || 3000;

// create twiiter object
const Twitter = require('twitter');
const client = require('./tclient.js');
var stream = {};
var searchKeywords = "";

// configure path for static and views
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// the home directory
app.get('/', (req, res) => {
    res.render('index.html');
});

// the search form
app.get('/search', (req, res) => {
    searchKeywords = req.query['q'];
    console.log('q: ' + searchKeywords);
    res.redirect('/stream');
});

// start the twitter stream
app.get('/stream', (req, res) => {
    stream = client.stream('statuses/filter', {track: searchKeywords});
    stream.on('data', function(event) {
        console.log(event && event.text);
    });
    stream.on('error', function(error) {
        throw error;
    });
    res.render('stream.html', {searchKeywords: searchKeywords});
});

// stop the twitter stream and return to index
app.get('/stop', (req, res) => {
    stream.removeAllListeners();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});