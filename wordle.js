// The code below selects the HTML elements with the class names 'tiles-container' and 'keyboard-container'.
const tileGrid = document.querySelector('.tiles-container');
const keyboardLayout = document.querySelector('.keyboard-container');
const msgDisplay = document.querySelector('.message-container');

let word

// This function fetches a word from a server running on localhost:8000 and sets it to uppercase
const getWord = () => {
  // The fetch function sends a GET request to the specified URL and returns a promise that resolves to the response object
  fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
      word = json.toUpperCase()
    })
    .catch(err => console.log(err))
}
// Call the getWord function to fetch and process the word
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


//button clicks
const buttonClick = (letter) => {
  if (!endGame) {
    // If the clicked button is "DEL", removing the last letter from the current guess.
    if (letter === 'DEL') {
      deletingLetter();
      return;
    }
    // If the clicked button is "ENTER", checking if the current guess is correct.
    if (letter === 'ENTER') {
      checkGuess();
      return;
    }
    // If the clicked button is a letter, adding it to the current guess.
    addingLetter(letter)

  }
}


//adding a letter to a tile 
const addingLetter = (letter) => {
  // Checking if the current active tile is less than 5
  if (activeTile < 5) {
    const tile = document.getElementById('inputRow-' + activeRow + '-tiles-' + activeTile)
    tile.textContent = letter
    inputRows[activeRow][activeTile] = letter
    tile.setAttribute('data', letter)
    // Incrementing the activeTile counter for the next letter to be added.
    activeTile++
  }
}


//deleting a letter from a tile
const deletingLetter = () => {
  if (activeTile > 0) {
    // Decrementing the active tile index by 1
    activeTile--
    const tile = document.getElementById('inputRow-' + activeRow + '-tiles-' + activeTile)
    tile.textContent = ''
    inputRows[activeRow][activeTile] = ''
    // Setting the 'data' attribute of the tile element to an empty string
    tile.setAttribute('data', '')
  }
}


//checking each guess 
const checkGuess = () => {
  // Getting the user's guess by joining the input letters in the active row.
  const guess = inputRows[activeRow].join('')
  // If the user has filled all five tiles in a row:
  if (activeTile > 4) {
    //i make a request to the local server to check if the guess is a valid word.
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then(response => response.json())
      .then(json => {

        // If the guess is not a valid word:
        if (json == 'Entry word not found') {
          displayMessage('word not in list')
          return
        } else {
          //to display the guess in console
          console.log('guess is ' + guess, 'word is ' + word);
          flippingTiles()

          // If the guess matches the word:
          if (word == guess) {
            displayMessage('You guessed the word!')
            endGame = true;
            return;
          } else {

            // If the guess does not match the word and the game is over:
            if (activeRow >= 5) {
              endGame = true;
              displayMessage('Game Over!')
              return;
            }
            if (activeRow < 5) {
              // Move to the next row if there are more rows left.
              activeRow++
              activeTile = 0
            }
          }
        }

      }).catch(err => console.log(err))
  }




  //display message 
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


  //adding colour to the tiles after a user's guess
  const flippingTiles = () => {
    const singleTiles = document.querySelector('#inputRow-' + activeRow).childNodes
    let checkWord = word
    const guesses = []


    singleTiles.forEach(tile => {
      guesses.push({ letter: tile.getAttribute('data'), colour: 'grey-tile' })
    })

    // Looping through the guessed letters and update their colours if they match the word.
    guesses.forEach((guesses, index) => {
      if (guesses.letter == word[index]) {
        guesses.colour = 'green-tile'
        checkWord = checkWord.replace(guesses.letter, '')
      }
    })

    // Looping through the guessed letters and update their colours if they are in the word but not in the right position.
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
        // Adding the corresponding colour class to the keyboard key.
        addKeyboardColour(guesses[index].letter, guesses[index].colour);
      }, 500 * index)

    });
  }
}