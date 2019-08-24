require('dotenv').config();

// set up express, io server, and requirements
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path  = require('path');
const port = process.env.PORT || 3000;

// create twiiter object
const Twitter = require('twitter');
const client = require('./tclient.js');
var stream = {};

// configure path for static and views
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', './views');
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// the home directory
app.get('/', (req, res) => {
    res.render('index.html');
})

// log whenver a user connects or disconnects
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
})

// start the twitter stream based on search
app.get('/search', (req, res) => {
    let searchKeywords = req.query['q'];
    console.log('q: ' + searchKeywords);
    stream = client.stream('statuses/filter', {track: searchKeywords});
    stream.on('data', function(event) {
        //console.log(event && event.text);
        io.volatile.emit('tweet', event.text); 
    })
    stream.on('error', function(error) {
        throw error;
    })
    res.render('stream.html', {searchKeywords: searchKeywords});
})

// stop the twitter stream and return to index
app.get('/stop', (req, res) => {
    stream.removeAllListeners();
    res.redirect('/');
})

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})