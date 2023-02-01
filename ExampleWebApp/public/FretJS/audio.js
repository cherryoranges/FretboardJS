// get audio context of browser to play sounds
const createAudioContext = function () {
    // create new audio context and set it as property
    // NOTE: must be called within user action (button press, etc. )
    const audioContext = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
    return audioContext
}

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
const beep = function(audioContext, duration, frequency, volume, type, callback) {
    var oscillator = audioContext.createOscillator();
    var gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + ((duration || 500) / 1000));
}
