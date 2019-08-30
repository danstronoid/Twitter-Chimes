require('dotenv').config();

// set up express, io server, and requirements
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path  = require('path');
const port = process.env.PORT || 3000;

// configure template engine and views
app.set('views', './views');
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// configure path for static and controllers
app.use(express.static(path.join(__dirname, '/public')));
app.use(require('./middleware/error-handler.js'));
app.use(require('./controllers/users.js'));
app.use(express.urlencoded({ extended: false }));

// create the twitter stream
const twitterStream = require('./models/twitter-stream.js');
twitterStream.createStream(io);

// log whenver a user connects or disconnects
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});