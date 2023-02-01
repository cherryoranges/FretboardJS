# js-library-dyagile1
# FretJS

# Web App Link (Heroku)

https://fretjs.herokuapp.com/

# Getting Started

```
// Step 1: Import Fret.js library into your Webpage index.html

// fretboard.js contains fretboard visualizer 
<script type="text/javascript" src="public/FretJS/fretboard.js"/>

// OPTIONAL IMPORTS: Extra functionality (For sound and color)

// Import tonal.js requirement (music theory library)
<script src="https://cdn.jsdelivr.net/npm/@tonaljs/tonal/browser/tonal.min.js"/>

// notes.js contains helpers for colouring and filtering notes
<script type="text/javascript" src="public/FretJS/notes.js"></script>

// audio.js contains helpers for playing tones
<script type="text/javascript" src="public/FretJS/audio.js"></script>

// Step 2: Create Figure element for the Fretboard visualizer
<figure id="fretboard" />

// Step 3: Customize Fretboard and Play with it in your own JS code 
<script>
    // Draw board 
    const figureElement = document.getElementById(`fretboard`)
    const fretboard = Fretboard(figureElement)
    fretboard.drawBoard()
    fretboard.drawStrings()

    // Customize fretboard
    fretboard.fretboardColor = '#40020b'
    fretboard.height = 130
    fretboard.fadeOutLength = 2000
    
    // Draw notes
    fretboard.drawDot({ stringIndex: 0, fretIndex: 0, noteName: "E3", dotFill: 'red'})
    // ... draw a bunch of notes then clear fretboard
    fretboard.eraseDots() 
</script>
```

# Documentation

https://fretjs.herokuapp.com/#docs
