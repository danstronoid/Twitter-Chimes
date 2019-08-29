require('dotenv').config();

// set up express, io server, and requirements
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path  = require('path');
const port = process.env.PORT || 3000;

// configure path for static and views
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

// use urlencoded
app.use(express.urlencoded({ extended: false }));

const client = require('./twitter-api.js');
const Stream = require('twitter-lite/stream');
// a word for twitter to track
var keyword = 'Wind';
var alive = true;

// create a new twitter stream
function createStream() {
    // create a new stream 
    let stream = client.stream('statuses/filter', {track: keyword});

    // test new stream
    stream.on('start', () => {
        console.log("new stream");
    })

    // emit the data from the stream
    stream.on('data', data => {
        //console.log(data && data.text);
        io.volatile.emit('tweet', data.text, data.id_str);
    });

    // if an error occurs, destroy the stream
    stream.on('error', error => {
        console.error(error);
        process.nextTick(() => { 
            stream.destroy();
            alive = false;
            console.log("stream destroyed");
        });
    });

    // if the stream ends, attempt to restart the stream
    stream.on('end', () => {
        console.log("end");
        createStream();
    })
}
createStream();

// error-handler middleware for a stream error
app.use(function streamError (req, res, next) {
    if (!alive) {
        console.error("dead stream");
        res.status(500).render('error.html');
    } else {
        next();
    }
})

// log whenver a user connects or disconnects
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
})

// the home directory
app.get('/', (req, res) => {
    let phrase = "Start the stream..."
    res.render('index.html', {keyword: keyword, phrase: phrase});
})

// start the twitter stream based on search
app.get('/stream', (req, res) => {
    let phrase = "Listen to the breeze...";
    res.render('stream.html', {keyword: keyword, phrase: phrase});
})

// stop the twitter stream and return to index
app.get('/stop', (req, res) => {
    process.nextTick(() => res.redirect('/'));
})

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})