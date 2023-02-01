// return object containing library methods and variables
function Fretboard(figureElement) {

    // object holding library api
    const _self = {}

    // default values

    // tuning setup
    _self.tuning = ["E4", "B3","G3","D3","A2","E2"]
    _self.stringSizes = [1, 1, 2, 3, 4, 5,]
    _self.fretCount = 15

    // sizes of divs
    _self.height = 130
    _self.width = 500
    _self.fretWidth = 4
    _self.stringDivHeight = _self.height / _self.tuning.length
    _self.fretDivWidth = _self.width / _self.fretCount
    
    // visual styling
    _self.dotSize = 20
    _self.dotFill = 'lightgreen'
    _self.dotTextSize = 12
    _self.dotTextColor = 'white'
    _self.dotShadow = '2px 2px 5px #4d4d4d'
    _self.dotBorder = '2px solid white'

    _self.fretboardColor = '#40020b'

    _self.fretColor = 'silver'
    _self.openFretColor = 'darkgrey'

    _self.stringColor = 'gold'
    _self.stringOpacity = 0.6
    _self.stringShadow = '2px 2px 5px #4d4d4d'

    _self.fretIndicatorColor = 'silver'
    _self.fretIndicatorSize = 10

    _self.fadeOutLength = 2000

    // grab/mutate dom elements
    _self.figure = figureElement

    // User API
    
    // Render notes as dots on fretboard
    _self.drawDots = function(dots, lifespan, onBirth=(dot)=>{}, onDeath=(dot)=>{}) {
        for (let i=0; i< dots.length; i++) {
            _self.drawDot(dots[i], lifespan, onBirth, onDeath)
        }
    }

    _self.eraseDots = function() {
        const dotDivs = _self.figure.getElementsByClassName('dotDiv')

        while (dotDivs[0]) {
            dotDivs[0].parentNode.removeChild(dotDivs[0])
        }
    }

    // Helper API

     // draw fretboard 
     _self.drawBoard = function() {
        // create fretboard element
        const fretboardDiv = document.createElement("div")
        fretboardDiv.classList.add('fretboardDiv')

        // add styling
        fretboardDiv.style.height = `${_self.height}px`
        fretboardDiv.style.width = `${_self.width}px`
        fretboardDiv.style.position = 'relative'

        fretboardDiv.style.backgroundColor = _self.fretboardColor
        
        // insert into parent figure 
        _self.figure.appendChild(fretboardDiv)

        // split fretboard into strings and frets
        for (let s=0; s < _self.tuning.length; s++) {
            // create string row element
            const stringRowDiv = document.createElement("div")
            stringRowDiv.classList.add('stringRowDiv')
            stringRowDiv.classList.add(`stringIndex${s}`) // add string index as class

            // add styling
            stringRowDiv.style.height = `${_self.stringDivHeight}px`
            stringRowDiv.style.width = `${_self.width}px`
            stringRowDiv.style.position = 'relative'

            // flex settings to center children middle horiz+vert
            
            // create fret elements for string
            for (let f=0; f < _self.fretCount; f++) {
                const fretDiv = document.createElement("div")
                fretDiv.classList.add('fretDiv')
                fretDiv.classList.add(`fretIndex${f}`) // at fret index as class

                // position/size styling
                fretDiv.style.height = `${_self.stringDivHeight}px`
                
                fretDiv.style.width = `${_self.fretDivWidth}px`
                fretDiv.style.float = 'left' // align horizontally in stringRowDiv
                
                // flex settings to center children middle horiz+vert
                fretDiv.style.display = 'flex'
                fretDiv.style.alignItems = 'center'
                fretDiv.style.justifyContent = 'center'

                // visual styling
                // first fret is the open string fret, remove styling
                if (f === 0) {
                    fretDiv.style.borderWidth = '0px'
                    fretDiv.style.backgroundColor = _self.openFretColor

                } else {
                    fretDiv.style.boxSizing = 'border-box'
                    fretDiv.style.borderStyle = 'solid'
                    fretDiv.style.borderWidth = '0px'
                    fretDiv.style.borderLeftWidth = `${_self.fretWidth}px`
                    fretDiv.style.borderColor = _self.fretColor
                }
                
                // last fret has border on right in addition to the left
                if (f === _self.fretCount-1) {
                    fretDiv.style.borderRightWidth = `${_self.fret}px`
                }

                // insert fretDiv into stringRowDiv
                stringRowDiv.appendChild(fretDiv)
            }
            
            // insert stringRowDiv into fretboardDiv
            fretboardDiv.appendChild(stringRowDiv)
        }

        // draw fret indicators on frets 3, 5, 7, 12 and their integer multiples
        const makeFretIndicator = () => {
            const fretIndicator = document.createElement("div")
            fretIndicator.classList.add("fretIndicator")

            // add aesthetic styling
            fretIndicator.style.backgroundColor = _self.fretIndicatorColor
            fretIndicator.style.borderRadius = '50%'
            fretIndicator.style.height = `${_self.fretIndicatorSize}px`
            fretIndicator.style.width = `${_self.fretIndicatorSize}px`
            
            return fretIndicator
        }

        const addSingleFretIndicator = (fretIndex) => {
            const fretIndicator = makeFretIndicator()

            // add position styling
            fretIndicator.style.position = 'absolute'
            fretIndicator.style.top = `${_self.height / 2 - _self.fretIndicatorSize/2}px`
            fretIndicator.style.left = `${_self.fretDivWidth*fretIndex + _self.fretDivWidth/2 - _self.fretIndicatorSize/2}px`
            
            // add into parent div
            fretboardDiv.appendChild(fretIndicator)
        }

        const addDoubleFretIndicator = (fretIndex) => {
            const fretIndicatorOne = makeFretIndicator()
            const fretIndicatorTwo = makeFretIndicator()

            // add position styling
            fretIndicatorOne.style.position = 'absolute'
            fretIndicatorOne.style.top = `${_self.height / 3 - _self.fretIndicatorSize/2}px`
            fretIndicatorOne.style.left = `${_self.fretDivWidth*fretIndex + _self.fretDivWidth/2 - _self.fretIndicatorSize/2}px`
            
            fretIndicatorTwo.style.position = 'absolute'
            fretIndicatorTwo.style.top = `${2*_self.height / 3 - _self.fretIndicatorSize/2}px`
            fretIndicatorTwo.style.left = `${_self.fretDivWidth*fretIndex + _self.fretDivWidth/2 - _self.fretIndicatorSize/2}px`
            
            // add into parent div
            fretboardDiv.appendChild(fretIndicatorOne)
            fretboardDiv.appendChild(fretIndicatorTwo)
        }

        // iterate through fretboard adding single and double fretIndicators by rules
        for (let f=3; f < _self.fretCount; f+= 12) {
           addSingleFretIndicator(f)
        }
        for (let f=5; f < _self.fretCount; f+= 12) {
            addSingleFretIndicator(f)
        }
        for (let f=7; f < _self.fretCount; f+= 12) {
            addSingleFretIndicator(f)
        }
        for (let f=9; f < _self.fretCount; f+= 12) {
            addSingleFretIndicator(f)
        }
        for (let f=12; f < _self.fretCount; f+= 12) {
            addDoubleFretIndicator(f)
        }
    }

    _self.drawDot = function(dotObj, lifespan=null, onBirth=(dot)=>{}, onDeath=(dot)=>{}) {
        const { stringIndex, fretIndex, dotFill, noteName, dotShadow, dotBorder, dotSize} = dotObj
        
        // get div dom element holding fret
        const fretDiv = _self.getFretDiv(stringIndex, fretIndex)
        
        // create dot element
        const dotDiv = document.createElement("div")
        dotDiv.classList.add('dotDiv')

        // execute onBirth callback on creation and onDeath callback after lifespan millsecs
        setTimeout(() => onBirth(dotObj), 0)
        setTimeout(() => onDeath(dotObj), lifespan)

        // remove element after lifespan with animation
        if (lifespan) {
            setTimeout(() => removeFadeOut(dotDiv, _self.fadeOutLength), lifespan)
        }


        // add noteName text label if provided
        if (noteName) {
            const dotTextDiv = document.createElement("div")
            dotTextDiv.classList.add('dotTextDiv')
            const dotText = document.createTextNode(noteName)
            dotTextDiv.style.paddingTop = `${_self.dotTextSize/4}px`

            // add position styling
            // flex settings to center children middle horiz+vert
            dotTextDiv.style.display = 'flex'
            dotTextDiv.style.alignItems = 'center'
            dotTextDiv.style.justifyContent = 'center'
            
            // add aesthetic styling
            dotTextDiv.style.fontSize = `${_self.dotTextSize}px`
            dotTextDiv.style.color = _self.dotTextColor

            dotTextDiv.appendChild(dotText)    
            
            dotDiv.appendChild(dotTextDiv)
        } 

        // add styling
        dotDiv.style.height =  `${dotSize ? dotSize : _self.dotSize}px`
        dotDiv.style.width =  `${dotSize ? dotSize : _self.dotSize}px`
        dotDiv.style.borderRadius = `50%`
        dotDiv.style.backgroundColor = dotFill ? dotFill :  _self.dotFill
        dotDiv.style.position = 'absolute'
        dotDiv.style.boxShadow = dotShadow ? dotShadow : _self.dotShadow
        dotDiv.style.border =dotBorder ? dotBorder :  _self.dotBorder

        // insert into parent figure 
        fretDiv.appendChild(dotDiv)
    }

    // Return dom element with unique class name
    _self.getStringDiv = function(stringIndex) {
        const elements = _self.figure.getElementsByClassName(`stringIndex${stringIndex}`)
        return elements[0] // should be only one
    }

    // Return dom element with unique class name
    _self.getFretDiv = function(stringIndex, fretIndex) {
        const stringDiv = _self.getStringDiv(stringIndex)
        const elements = stringDiv.getElementsByClassName(`fretIndex${fretIndex}`)
        return elements[0] // should be only one
    }

    _self.drawStrings = function() {
        for (let i=0; i < _self.tuning.length; i++) {
            const stringDiv = _self.getStringDiv(i)
            
            // create div representing actual guitar string visual
            const stringLineDiv = document.createElement('div')
            stringLineDiv.classList.add('stringLineDiv')

            // add styling
            const stringWidth = _self.stringSizes[i]
            stringLineDiv.style.height = `${stringWidth}px`
            stringLineDiv.style.width = `${_self.width}px`
            stringLineDiv.style.backgroundColor = _self.stringColor
            stringLineDiv.style.opacity = _self.stringOpacity
            stringLineDiv.style.boxShadow = _self.stringShadow


            // move string to vertical middle of stringRow 
            stringLineDiv.style.position =  'absolute'
            stringLineDiv.style.top = `${this.stringDivHeight/2 - stringWidth/2}px`

            // remove any old 'stringLineDiv' child
            for (let i=0; i < stringDiv.childNodes.length; i++) {
                const child = stringDiv.childNodes[i]
                if (child.classList.contains('stringLineDiv')) {
                    stringDiv.removeChild(child)
                }   
            }
            
            // insert into parent figure 
            stringDiv.appendChild(stringLineDiv)
        }
    }

  
    // insert cssFile as stylesheet link in the document that the parent script is in
    _self.injectStyleIntoDOM = function(cssFile) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            `<link rel=\"stylesheet\" href=\"${cssFile}\" />`);
    }


    // return library object
    return _self
}

// Helper functions

// remove an element from dom with fadeOut animation
function removeFadeOut( el, speed ) {
    var seconds = speed/1000;
    el.style.animation = `fadeOut ${2}s`
    el.style.transition = `opacity ${seconds}s ease`;

    el.style.opacity = 0;
    setTimeout(function() {
        el.parentNode.removeChild(el);
    }, speed);
}