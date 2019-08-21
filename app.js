const express = require('express');
const app = express();
const path  = require('path');
const port = process.env.PORT || 3000;

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
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});