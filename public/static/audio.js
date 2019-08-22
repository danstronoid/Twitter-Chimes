
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// test browser for Web Audio API
// build master volume node
// build mix node
// build fx

// generate a random pan value between -1 and 1 
// with two decimal places of precision
function getRndPan(){
    return (Math.floor(Math.random() * 200) + 1) / 100 - 1;
};

// this function creates a sine oscillator
function playChime(frequency=440, attackTime=0.05, releaseTime = 0.2){
    // define the osc
    var osc = audioCtx.createOscillator();
    osc.channelcount = 2;
    osc.type = "sine";
    osc.frequency.value = frequency;
    
    // define the env
    var sineEnv = audioCtx.createGain();
    sineEnv.gain.cancelScheduledValues(audioCtx.currentTime);
    sineEnv.gain.setValueAtTime(0, audioCtx.currentTime);
    sineEnv.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + attackTime);
    // setTimeout on release???
    sineEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + attackTime + releaseTime);

    // define stereo panning
    var sinePan = audioCtx.createStereoPanner();
    sinePan.pan.setValueAtTime(getRndPan(), audioCtx.currentTime);

    // route the osc to desination and start playback
    osc.connect(sineEnv).connect(sinePan);
    sinePan.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + attackTime + releaseTime);

    console.log("Playing sine osc");
};

document.querySelector('#playSound').addEventListener('click', function() {
    audioCtx.resume().then(() => {
        console.log('Playback resumed successfully');

        playChime();

        });
});





