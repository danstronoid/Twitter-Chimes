"use strict";

// initialize global variables (these are necessary)
const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) {
    alert("Web Audio API not supported in browser");
}
const audioCtx = new AudioContext();
const masterFader = audioCtx.createGain();
const reverb = audioCtx.createConvolver();
const reverbAmt = audioCtx.createGain();
var fmMutli = 1;
var oscType = "sine";

// setup reverb, volume, and test button
function setup() {
    // load impulse response
    fetch('/wav/Mechanics_IR.wav')
        .then(response => {
            return response.arrayBuffer();  
        }).then(buffer => {
            audioCtx.decodeAudioData(buffer, decoded => {
                reverb.buffer = decoded; 
            });
        });

    // button to test playback
    document.querySelector('#playSound').addEventListener('click', function() {
        audioCtx.resume().then(() => {
            console.log('Playback resumed successfully');
            let frequency = getRndFreq();
            playChime(frequency);
        });
    });

    // create a master volume control
    let volumeControl = document.querySelector("#volumeControl");
    volumeControl.addEventListener("input", function() {
        masterFader.gain.value = volumeControl.value;
    }, false);
    masterFader.connect(audioCtx.destination);

    // create a reverb control and connect to master
    reverbAmt.gain.value = 0.25;
    let reverbControl = document.querySelector("#reverbControl");
    reverbControl.addEventListener("input", function() {
        reverbAmt.gain.value = reverbControl.value;
    }, false);
    reverb.connect(reverbAmt);
    reverbAmt.connect(masterFader);

    // create an FM control and connect to master
    let fmControl = document.querySelector("#fmControl");
    fmControl.addEventListener("input", function() {
        fmMutli = fmControl.value;
    }, false);

    // create a selector for oscillator type
    let oscTypeControl = document.querySelector("#oscType");
    oscTypeControl.addEventListener("input", function() {
        oscType = oscTypeControl.value;
    }, false);    

    // create a selector for tonality
    let tonalitySelect = document.querySelector("#tonality");
    tonalitySelect.addEventListener("input", function() {
        if (tonalitySelect.value == "maj")
        {
            notes = majPenta;
            console.log("maj");
        }    
        else
        {
            notes = minPenta;
            console.log("min");
        }

    }, false); 

}

window.addEventListener("load", setup, false);





