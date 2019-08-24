"use strict";

//create socket object
const socket = io();

// set the max allowed length of tweet
const maxLen = 140;

socket.on('tweet', function(text) {
    //console.log(text);

    // create a linear scale based on tweet length
    let tweetLen = text.length;
    if (tweetLen > maxLen)
        tweetLen = maxLen;
    let scale = tweetLen / maxLen;

    // assign parameters and play sound
    let frequency = getRndFreq();
    let modDepth = scale * 500;
    let amp = scale * 0.2;
    let releaseTime = scale * 1;
    playChime(frequency, modDepth, amp, attackTime=0.05, releaseTime);
})