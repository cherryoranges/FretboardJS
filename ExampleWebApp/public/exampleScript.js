`dot object
{
    // required
    stringIndex: int,
    fretIndex: int,

    // optional
    dotFill: string,
    noteName: string,
}
`
const addDotFill = (dot, pallete) => {
    // get absolute pitch class 
    const tonalNote = Tonal.Note.get(dot.noteName)
    const pitchClass = tonalNote.pc

    // get color by pitch
    const color = pallete[pitchClass]
    dot.dotFill = color
    return dot
}

const addFrequency = (dot) => {
    const frequency = Tonal.Note.get(dot.noteName).freq
    dot.frequency = frequency
    return dot
}

// return true if dot between left fret and right fret
function isDotBetween (d, leftFret, rightFret) {
    return d.fretIndex >= leftFret && d.fretIndex <= rightFret
}

// Returns an object mapping caged shape (CAGED) => tuple (leftFret, rightFret) for each of the 5 CAGED positions for rootNote
function getFretValuesForCAGED(rootNote, tuning=["E4", "B3","G3","D3","A2","E2"]) {
    // EADGBE TUNING IS ASSUMED!
    const rootFretIndex_e = getFretIndex(rootNote, tuning[5])
    const rootFretIndex_A = getFretIndex(rootNote, tuning[4])
    const rootFretIndex_D = getFretIndex(rootNote, tuning[3])
    const rootFretIndex_G = getFretIndex(rootNote, tuning[2])
    const rootFretIndex_B = getFretIndex(rootNote, tuning[1])
    const rootFretIndex_E = getFretIndex(rootNote, tuning[0])

    let cagedFrets = {
        "C": [rootFretIndex_A-3, rootFretIndex_A],
        "A": [rootFretIndex_A-1, rootFretIndex_A+3],
        "G": [rootFretIndex_E-4, rootFretIndex_E],
        "E": [rootFretIndex_E-1, rootFretIndex_E+2],
        "D": [rootFretIndex_D-1, rootFretIndex_D+3],
    }

    return cagedFrets
}


function playNote(noteName, duration,audioContext, fretboard, noteFilter= d=>true, playOne=false) {
    setTimeout(() => {
        // get all dots on fretboard for the note
        let dots = getAllPostions(noteName, fretboard.tuning, fretboard.fretCount)

        // filter notes by argument function. useful to selected subset of all notes to render
      
        dots  = dots.filter(noteFilter)
 
        
        // add properties 
        dots = dots
        .map(d => addDotFill(d, notePallete)) // add color
        .map(d => addFrequency(d)) // add tone

        // callbacks on birth and death of dot
        onBirth = function(dot) {
            // play tone for time
            beep(audioContext, duration, dot.frequency, 1, 'sine')

        }
        onDeath = function(dot) {
        }

        // filter notes to get the first one
        if (playOne)
            if (dots.length > 0 ){
                fretboard.drawDot(dots[0], lifespan=duration, onBirth, onDeath)
            } else {

            } 
        
        else {
            fretboard.drawDots(dots, lifespan=duration, onBirth, onDeath)
        }
        
    
    }, 0)
}

function drawCAGED(rootNote, fretboard, mode='major') {
    // take the notes for the scale CAGED is based off. 
    const lowestNote = `${rootNote}1`
    const highestNote =  `${rootNote}100` // bruteforce draw up 100 octaves of notes
    const cagedNotes = Tonal.Scale.rangeOf(`${rootNote} ${mode}`)(lowestNote, highestNote)
    
    // draw all positions for every note
    for (let i=0; i<cagedNotes.length; i++) {
        let dots = getAllPostions(cagedNotes[i], fretboard.tuning, fretboard.fretCount)

        // add properties to dot objects
        dots.map(d => d.noteName = null)  // remove name to not draw it
        dots.map(d => d.dotFill = 'grey') // make grey dot

        fretboard.drawDots(dots) // draw dots statically
    }
}


// initialize fretboards for all examples
const fretboards = []
const numFretboards = 4
for (let i=0; i<numFretboards; i++) {
    const figureElement = document.getElementById(`fretboard${i+1}`)
    const fretboard = Fretboard(figureElement)
    
    fretboard.drawBoard()
    fretboard.drawStrings()
    fretboards.push(fretboard)
}

// color pallete using for gving notes a color
const notePallete = NOTE_COLORS.vlads


// EXAMPLE #1

// // draw c chord using native library
fretboards[0].drawDot({ stringIndex: 5, fretIndex: 3 })
fretboards[0].drawDot({ stringIndex: 4, fretIndex: 3 })
fretboards[0].drawDot({ stringIndex: 3, fretIndex: 2 })
fretboards[0].drawDot({ stringIndex: 2, fretIndex: 0, noteName: "G3", dotFill: notePallete["G"]})
fretboards[0].drawDot({ stringIndex: 1, fretIndex: 1, noteName: "C3", dotFill: notePallete["C"]})
fretboards[0].drawDot({ stringIndex: 0, fretIndex: 0, noteName: "E3", dotFill: notePallete["E"]})


// EXAMPLE #2

// Play Scale

// add scales into datalist
const tonalScales = Tonal.Scale.names()
const scaleDatalist = document.getElementById("scaleList")
for (let i=0; i<tonalScales.length; i++) {
    const option = document.createElement("option")
    option.value = tonalScales[i]
    option.text = tonalScales[i]
    scaleDatalist.appendChild(option)
}

const keyOctaveInput = document.getElementById('keyOctaveInput')
const scaleInput = document.getElementById('scaleListChoice')

const playButton = document.getElementById('playButton')
playButton.addEventListener('click', function(e) {
    const selectedScale = scaleInput.value
    const keyOctave = keyOctaveInput.value

    const nextOctave = Tonal.Note.transpose(keyOctave, Tonal.Interval.fromSemitones(12))

    const scaleRange = Tonal.Scale.rangeOf(`${keyOctave[0]} ${selectedScale}`)
    const notes = scaleRange(keyOctave, nextOctave)
    
    const audioContext = createAudioContext()

    for (let i=0; i < notes.length; i++) {
        const noteName = notes[i]
        setTimeout(() => playNote(noteName, 500, audioContext, fretboards[1], noteFilter=d=>true, playOne=true),
            500*i
        )
        
    }
})

// EXAMPLE #3

// Draw CAGED system 
const cagedRootNote = document.getElementById("cagedRootNote")
const renderCagedButton = document.getElementById("renderCagedButton")
renderCagedButton.addEventListener('click', function(e) {
    fretboards[2].eraseDots()
    drawCAGED(cagedRootNote.value, fretboards[2])
})

// Choose CAGED shape

const cagedShapeInput = document.getElementById('cagedShapeChoice')
const playCagedShapeButton = document.getElementById('playCagedButton')
playCagedShapeButton.addEventListener('click', () => {

    const selectedScale = 'major'
    const keyOctave = 'c3'

    const nextOctave = Tonal.Note.transpose(keyOctave, Tonal.Interval.fromSemitones(12))

    const scaleRange = Tonal.Scale.rangeOf(`${keyOctave[0]} ${selectedScale}`)
    const notes = scaleRange(keyOctave, nextOctave)

    const cagedShapes = getFretValuesForCAGED(keyOctave[0])
    const fretBounds = cagedShapes[cagedShapeInput.value]
    
    const audioContext = createAudioContext()

    for (let i=0; i < notes.length; i++) {
        const noteName = notes[i]
        const noteFilter = (n)=>isDotBetween(n, fretBounds[0], fretBounds[1])
        setTimeout(() => playNote(noteName, 500, audioContext, fretboards[2], noteFilter, true),
            500*i
        )
    }
})
    

// EXAMPLE #4

// play MIDI file
const playMidi = async () => {
    const midi = await Midi.fromUrl("public/fur_elise.mid")
    const audioContext = createAudioContext()

    // // within a shape
    // const cagedShapes = getFretValuesForCAGED("C")
    // const fretBounds = cagedShapes.D
    // const noteFilter=(n)=>isDotBetween(n, fretBounds[0], fretBounds[1])

    midi.tracks.forEach(track => {
        const notes = track.notes

        notes.forEach(note => {

            const playMidiNote = function ({name, duration, time}) {
                // play named note starting at time for duration
                setTimeout(() => playNote(name, duration*1000, audioContext, fretboards[3],noteFilter=d=>true, playOne=true), 
                    time*1000,)
            }

            playMidiNote(note)
        })
    })
}
const playMidiButton = document.getElementById("playMidiButton")
playMidiButton.addEventListener("click", (e) => {
    playMidi()
})
