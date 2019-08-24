"use strict";

// create array of midi note numbers
function noteFreq(){
    let midiNotes = [];
    const semitone = 1.059463;
    for (let i = 0; i < 128; i++) {
        let note = 440 * Math.pow(semitone, (i - 69));
        midiNotes[i] = note.toFixed(2);
    }    
    return midiNotes;
}
const midiNotes = noteFreq();

// select a random note from an A-minor Pentatonic Scale in 4 octaves
function getRndFreq(){
    
    let notes = [ midiNotes[45], midiNotes[48], midiNotes[50], midiNotes[52], midiNotes[55],
                  midiNotes[57], midiNotes[60], midiNotes[62], midiNotes[64], midiNotes[67], 
                  midiNotes[69], midiNotes[72], midiNotes[74], midiNotes[76], midiNotes[79], 
                  midiNotes[81], midiNotes[84], midiNotes[86], midiNotes[88], midiNotes[91] ];
    return notes[Math.floor(Math.random() * 20)];
}

// generate a random pan value between -1 and 1 
// with two decimal places of precision
function getRndPan(){
    return (Math.floor(Math.random() * 200) + 1) / 100 - 1;
}