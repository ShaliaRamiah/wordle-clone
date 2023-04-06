// The code below selects the HTML elements with the class names 'tiles-container' and 'keyboard-container'.
const tileGrid = document.querySelector('.tiles-container');
const keyboardLayout = document.querySelector('.keyboard-container');
const msgDisplay = document.querySelector('.message-container');

let word


const getWord = () => {
  fetch('http://localhost:8000/word')
  .then(response => response.json())
  .then(json => {
      word = json.toUpperCase()
    })
    .catch(err => console.log(err))
}

getWord();

// creating an array 'keyboardKeys' that stores strings of letters, ENTER, and DEL.
const keyboardKeys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'DEL',
]

// array 'inputRows' with empty strings.
const inputRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']

]

let activeRow = 0
let activeTile = 0
let endGame = false



// The code below iterates through each row in 'inputRows' and creates a div element with an ID, and then appends
inputRows.forEach((inputRow, inputRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'inputRow-' + inputRowIndex)
  inputRow.forEach((input, inputIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'inputRow-' + inputRowIndex + '-tiles-' + inputIndex)
    //line below displays the tiles
    tileElement.classList.add('tiles')
    rowElement.append(tileElement)
  })
  tileGrid.append(rowElement)
})



// The code below iterates through each key in the 'keyboardKeys' array and creates a button element with the key value as text,
// and an ID attribute with the key value. An event listener is added to each button element to listen for clicks,
// and the button element is appended to the 'keyboard-container' HTML element.
keyboardKeys.forEach(keyboardKey => {
  const keyboardButton = document.createElement('button')
  keyboardButton.textContent = keyboardKey
  keyboardButton.setAttribute('id', keyboardKey)
  keyboardButton.addEventListener('click', () => buttonClick(keyboardKey))
  keyboardLayout.append(keyboardButton)
});



const buttonClick = (letter) => {
  if(!endGame){
    if (letter === 'DEL') {
      deletingLetter();
      return;
    }
    if (letter === 'ENTER') {
      checkGuess();
      return;
    }
    addingLetter(letter)
  
  }
}



const addingLetter = (letter) => {
  if (activeTile < 5 && activeTile < 6) {
    const tile = document.getElementById('inputRow-' + activeRow + '-tiles-' + activeTile)
    tile.textContent = letter
    inputRows[activeRow][activeTile] = letter
    tile.setAttribute('data', letter)
    activeTile++
  }
}



const deletingLetter = () => {
  if (activeTile > 0) {
    activeTile--
    const tile = document.getElementById('inputRow-' + activeRow + '-tiles-' + activeTile)
    tile.textContent = ''
    inputRows[activeRow][activeTile] = ''
    tile.setAttribute('data', '')
  }
}



const checkGuess = () => {
  const guess = inputRows[activeRow].join('')

  if (activeTile > 4) {


    fetch(`http://localhost:8000/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Entry word not found') {
                    showMessage('word not in list')
                    return
                } else {
          flippingTiles()
          if (word == guess) {
            displayMessage('You guessed the word!')
            endGame = true;
            return;
          } else {
            if (activeRow >= 5) {
              endGame = true;
              displayMessage('Game Over!')
              return;
            }
            if (activeRow < 5) {
              activeRow++
              activeTile = 0
            }
          }
        }
      
      }).catch(err => console.log(err))
  }

      



const displayMessage = (message) => {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  msgDisplay.append(messageElement)
  setTimeout(() => msgDisplay.removeChild(messageElement), 2000)
}



const addKeyboardColour = (keyLetter, colour) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(colour)
}



const flippingTiles = () => {
  const singleTiles = document.querySelector('#inputRow-' + activeRow).childNodes
  let checkWord = word
  const guesses = []

  singleTiles.forEach(tile => {
    guesses.push({ letter: tile.getAttribute('data'), colour: 'grey-tile' })
  })

  guesses.forEach((guesses, index) => {
    if (guesses.letter == word[index]) {
      guesses.colour = 'green-tile'
      checkWord = checkWord.replace(guesses.letter, '')
    }
  })


  guesses.forEach(guesses => {
    if (checkWord.includes(guesses.letter)) {
      guesses.colour = 'yellow-tile'
      checkWord = checkWord.replace(guesses.letter, '')
    }
  })


  singleTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip')
      tile.classList.add(guesses[index].colour);
      addKeyboardColour(guesses[index].letter, guesses[index].colour);
    }, 500 * index)

  });
}
}