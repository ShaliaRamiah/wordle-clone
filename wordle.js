// The code below selects the HTML elements with the class names 'tiles-container' and 'keyboard-container'.
const tileGrid = document.querySelector('.tiles-container');
const keyboardLayout = document.querySelector('.keyboard-container');

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

// The code below iterates through each row in 'inputRows' and creates a div element with an ID, and then appends
inputRows.forEach((inputRow, inputRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'inputRow-' + inputRowIndex)
  inputRow.forEach((input, inputIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'inputRow-' + inputRowIndex + '-tiles-' + inputIndex)
    rowElement.append(tileElement)
  })
  tileGrid.append(rowElement)
})

// The code below defines a function 'buttonClick' that logs 'clicked' to the console.
const buttonClick = () => {
  console.log('clicked');
}

// The code below iterates through each key in the 'keyboardKeys' array and creates a button element with the key value as text,
// and an ID attribute with the key value. An event listener is added to each button element to listen for clicks,
// and the button element is appended to the 'keyboard-container' HTML element.
keyboardKeys.forEach(keyboardKey => {
  const keyboardButton = document.createElement('button')
  keyboardButton.textContent = keyboardKey
  keyboardButton.setAttribute('id', keyboardKey)
  keyboardButton.addEventListener('click', buttonClick)
  keyboardLayout.append(keyboardButton)
});