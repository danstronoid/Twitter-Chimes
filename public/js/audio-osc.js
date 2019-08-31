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