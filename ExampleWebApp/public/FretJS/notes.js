// contains logic and objects for rendering notes with fretboard 

const NOTE_COLORS = {
    "vlads": {
        "A": "#e23232",
        "A#": "#5ca3ff",
        "Bb": "#5ca3ff",
        "B": "#ba25f5",
        "C": "#e3e3e3",
        "C#": "#c6f7fd", 
        "Db": "#c6f7fd", 
        "D": "#45d856",
        "D#": "#fce61c",
        "Eb": "#fce61c",
        "E": "#fa851f",
        "F": "#3d3c3c",
        "F#": "#00027a",
        "Gb": "#00027a",
        "G": "#6d411a",
        "G#": "#961724",
        "Ab": "#961724",
    }
}

// return list of objects = {stringIndex: int, fretIndex: int} 
function getAllPostions(noteName, tuning, fretCount) {
    let positions = []

    // get all positions on each string 
    for (let i=0; i < tuning.length; i++) {
        const fretIndex = getFretIndex(noteName, tuning[i])
        
        if (fretIndex < fretCount && fretIndex >= 0) {
            const position = {
                stringIndex: i,
                fretIndex: fretIndex,
                noteName: noteName,
            }
            positions.push(position)
        }
    }   

    return positions
}

// returns number of frets to get from stringName to noteName (i.e. # of semitones)
function getFretIndex(noteName, stringName) {
    const interval = Tonal.Interval.distance(stringName,noteName,  )
    const semitones = Tonal.Interval.semitones(interval)
    return semitones
}