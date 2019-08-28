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
    fetch('/Mechanics_IR.wav')
        .then(response => {
            return response.arrayBuffer();  
        }).then(buffer => {
            audioCtx.decodeAudioData(buffer, decoded => {
                reverb.buffer = decoded; 
            })
        })

    // button to test playback
    document.querySelector('#playSound').addEventListener('click', function() {
        audioCtx.resume().then(() => {
            console.log('Playback resumed successfully');
            let frequency = getRndFreq();
            playChime(frequency);
        })
    })

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

// this function creates a sine oscillator, maybe try this as a class??
function playChime(frequency=440, modDepth=500, amp=0.2, attackTime=0.1, releaseTime=0.3){
    let now = audioCtx.currentTime;
    
    // create a modulation osc for FM
    let modOsc = audioCtx.createOscillator();
    modOsc.type = "sine";
    modOsc.frequency.value = frequency * 5; //modulate 5th harmonic
    let modGain = audioCtx.createGain();
    modGain.gain.value = modDepth * fmMutli;

    // define the osc
    let osc = audioCtx.createOscillator();
    osc.channelcount = 2;
    osc.type = oscType;
    osc.frequency.value = frequency;
    
    // define the env
    let oscEnv = audioCtx.createGain();
    oscEnv.gain.cancelScheduledValues(now);
    oscEnv.gain.setValueAtTime(0, now);
    oscEnv.gain.linearRampToValueAtTime(amp, now + attackTime);
    oscEnv.gain.linearRampToValueAtTime(0, now + attackTime + releaseTime);

    // define stereo panning
    let oscPan = audioCtx.createStereoPanner();
    oscPan.pan.setValueAtTime(getRndPan(), now);

    // route the modulator
    modOsc.connect(modGain);
    modGain.connect(osc.frequency);

    // route the osc to desination
    osc.connect(oscEnv);
    oscEnv.connect(oscPan);
    oscPan.connect(masterFader);
    oscPan.connect(reverb);
    oscPan.connect(masterFader);
    

    // start and stop playback
    modOsc.start();
    osc.start();
    osc.stop(now + attackTime + releaseTime);
    console.log("Playing chime");
}

window.addEventListener("load", setup, false);





