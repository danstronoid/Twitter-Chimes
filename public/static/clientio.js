const socket = io();

socket.on('tweet', function(text) {
    playChime();
});