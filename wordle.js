// The code below selects the HTML elements with the class names 'tiles-container' and 'keyboard-container'.
const tileGrid = document.querySelector('.tiles-container');
const keyboardLayout = document.querySelector('.keyboard-container');
const msgDisplay = document.querySelector('.message-container');


const word = 'AUDIT'

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

let activeRow = 0;
let activeTile = 0;
let endGame = false;

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
  console.log('clicked', letter)
  if (letter === 'DEL') {
    deletingLetter();
    console.log('inputRows', inputRows)
    return;
  }
  if (letter === 'ENTER') {
    checkGuess();
    console.log('inputRows', inputRows)
    return;
  }
  addingLetter(letter)
  console.log('inputRows', inputRows)

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
  const guess = inputRows[activeRow].join('');

  if (activeTile === 5) {
    console.log('guess is ' + guess, 'word is ' + word);
    flippingTiles()
    if (word == guess) {
      displayMessage('You guessed the word!');
      endGame = true;
      return;

    } else {
      if (activeRow >= 5) {
        endGame = false;
        displayMessage('Game Over!');
        return;
      }
      if (activeRow < 5) {
        activeRow++
        activeTile = 0
      }
    }
  }
}

const displayMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  msgDisplay.append(messageElement);
  setTimeout(() => msgDisplay.removeChild(messageElement), 2000);
}

const addKeyboardColour = (keyLetter, colour) => {
  const keyColour = document.getElementById(keyLetter);
  keyColour.classList.add(colour);
}

const flippingTiles = () => {
  const singleTiles = document.querySelector('#inputRow-' + activeRow).childNodes;
  let checkWord = word;
  const guesses = [];

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
  console.log('guess', guesses)

  singleTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip')
      tile.classList.add(guesses[index].colour);
      addKeyboardColour(guesses[index].letter, guesses[index].colour);

    }, 500 * index);

  });
}