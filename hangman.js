const words = ['Terri', 'Flowers', 'Rose', 'Rosemarie', 'Elise', 'Jimenez', 'Newman', 'Candice', 'Maricela', 'Mindy']

class Hangman {
  constructor(elements, className) {
    this.elements = elements
    this.className = className
  }

  start() {
    this.reset()
  }

  reset() {
    for (const elementName in this.elements) {
      this.elements[elementName].classList.add(this.className)
    }
  }

  show(elementName) {
    if (! this.elements.hasOwnProperty(elementName)) {
      throw new Error(`Element ${elementName} does not exist`)
    }

    this.elements[elementName].classList.remove(this.className)
  }

  showNext() {
    for (const elementName in this.elements) {
      if (this.elements[elementName].classList.contains(this.className)) {
        this.show(elementName)
        return
      }
    }

    throw new Error('No more steps to display')
  }
}

class Game {
  constructor() {
    this.correctGuesses = []
    this.failedGuesses = []
  }

  start(word) {
    this.word = word
    this.lettersToFind = this.word.split('').filter((letter, index, self) => index === self.indexOf(letter))
  }

  reset(word) {
    this.start(word)
    this.correctGuesses = []
    this.failedGuesses = []
  }

  hasBeenPlayed(letter) {
    return this.correctGuesses.indexOf(letter) > -1 || this.correctGuesses.indexOf(letter) > -1
  }

  tryLetter(letter) {
    if (letter.length !== 1) {
      throw new Error('You can try only one letter at a time')
    }

    if (this.hasBeenPlayed(letter)) {
      throw new Error('This letter has already been played')
    }

    if (this.word.indexOf(letter) > -1) {
      this.correctGuesses.push(letter)

      return true
    }

    this.failedGuesses.push(letter)

    return false
  }

  hasWon() {
    return this.correctGuesses.length === this.lettersToFind.length
  }

  hasLost() {
    return this.failedGuesses.length >= 10
  }
}

class Result {
  constructor(element) {
    this.element = element
  }

  start(word) {
    this.word = word
  }

  reset(word) {
    this.start(word)
    this.refresh()
  }

  refresh(correctGuesses = []) {
    let result = []

    for (const char of this.word) {
      let letterResult = '_'

      for (const correctGuess of correctGuesses) {
        if (char === correctGuess) {
          letterResult = correctGuess
        }
      }

      result.push(letterResult)
    }

    this.element.innerHTML = result.join(' ')
  }
}

class Manager {
  constructor(buttonsElements, words, game, hangman, result) {
    this.buttons = {}
    for (const buttonInput of buttonsElements) {
      this.buttons[buttonInput.value] = buttonInput
    }

    this.words = words
    this.game = game
    this.hangman = hangman
    this.result = result

    this.addButtonsHandlers(buttons)
    this.addKeyPressHandler(buttons)

    // this.result.refresh()
  }

  start() {
    this.restartGame()
  }

  addKeyPressHandler() {
    document.addEventListener('keypress', (event) => {
      const key = event.key.toUpperCase()
      if (this.buttons.hasOwnProperty(key)) {
        this.buttons[key].click()
      }
    })
  }

  addButtonsHandlers() {
    for (const letter in this.buttons) {
      const button = this.buttons[letter]

      button.addEventListener('click', () => {
        button.disabled = true
        this.refreshResult(this.game.tryLetter(letter))
      })
    }
  }

  refreshResult(success) {
    if (success) {
      this.result.refresh(this.game.correctGuesses)

      if (this.game.hasWon()) {
        alert(`Congratulations! You found the word ${this.word} Play again?`)
        this.restartGame()
      }
    } else {
      this.hangman.showNext()
      
      if (this.game.hasLost()) {
        alert(`The word was ${this.word}, try again!`)
        this.restartGame()
      }
    }
  }

  restartGame() {
    this.word = this.words[Math.floor(Math.random() * this.words.length)].toUpperCase()

    this.hangman.reset()
    this.game.reset(this.word)
    this.result.reset(this.word)

    for (const letter in this.buttons) {
      this.buttons[letter].disabled = false
    }
  }
}

const hangmanContainer = document.getElementById('hangman')
const resultContainer = document.getElementById('result')
const buttonsInputs = document.getElementById('buttons').getElementsByTagName('input')

const hangman = new Hangman({
  tray: hangmanContainer.getElementById('tray'),
  hangerMat: hangmanContainer.getElementById('hanger-mat'),
  hangerTop: hangmanContainer.getElementById('hanger-top'),
  rope: hangmanContainer.getElementById('rope'),
  head: hangmanContainer.getElementById('head'),
  body: hangmanContainer.getElementById('body'),
  leftArm: hangmanContainer.getElementById('left-arm'),
  rightArm: hangmanContainer.getElementById('right-arm'),
  leftLeg: hangmanContainer.getElementById('left-leg'),
  rightLeg: hangmanContainer.getElementById('right-leg'),
}, 'hidden')

const result = new Result(resultContainer)

const game = new Game()

const manager = new Manager(buttonsInputs, words, game, hangman, result)
manager.start()
