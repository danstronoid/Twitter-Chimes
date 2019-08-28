"use strict";


//twttr.widgets.load();

// set the max allowed length of tweet
const maxLen = 140;

// listen for tweet emits
socket.on('tweet', function(text, id) {
    console.log(text);

    // create a linear scale based on tweet length
    let tweetLen = text.length;
    if (tweetLen > maxLen)
        tweetLen = maxLen;
    let scale = tweetLen / maxLen;

    // assign parameters and play sound
    let frequency = getRndFreq();
    let modDepth = scale * 500;
    let amp = scale * 0.2;
    let attackTime = 0.05;
    let releaseTime = scale * 1;
    playChime(frequency, modDepth, amp, attackTime, releaseTime);

    let childCount = document.getElementById("#tweetbox").childElementCount;
    if (childCount > 4) {
        let tweetBox = document.getElementById("#tweetbox");
        let firstChild = document.getElementById("#tweetbox").firstElementChild;
        tweetBox.removeChild(firstChild);
    }

    //document.getElementById("#tweetbox").innerHTML = "";
    console.log(id);
    twttr.widgets.createTweet(
        id,
        document.getElementById("#tweetbox"),
        {
            align: 'center',
            cards: 'hidden',
        })
        .then(() => {
            console.log(childCount)
        });
    

    
    
})

