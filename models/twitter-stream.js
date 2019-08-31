const client = require('../util/twitter-oauth.js');
const stream = require('twitter-lite/stream');

// keep track of server status
var alive = true;

// create a new twitter stream
function createStream(io) {
    // change this eventually
    let keyword = 'Wind';

    // create a new stream 
    let stream = client.stream('statuses/filter', {track: keyword});

    // test new stream
    stream.on('start', () => {
        console.log("new stream");
    });

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
        createStream(io);
    });
}

module.exports.createStream = createStream;

module.exports.alive = () => {
    return alive;
}
