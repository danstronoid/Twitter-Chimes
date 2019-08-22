require('dotenv').config();

const express = require('express');
const app = express();
const path  = require('path');
const port = process.env.PORT || 3000;

// create twiiter object
const Twitter = require('twitter');
var client = require('./tclient.js');
var stream;

app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// the home directory
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// the search form
app.get('/search', (req, res) => {

    console.log('q: ' + req.query['q']);

    res.redirect('/stream');
});

// start the twitter stream
app.get('/stream', (req, res) => {

    stream = client.stream('statuses/filter', {track: 'potato'});
    stream.on('data', function(event) {
        console.log(event && event.text);
    });
    stream.on('error', function(error) {
        throw error;
    });

    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// stop the twitter stream and return to index
app.get('/stop', (req, res) => {

    stream.removeAllListeners();

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});