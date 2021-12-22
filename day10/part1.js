let fs = require('fs');
const { execPath } = require('process');

let parseInput = input => input.match(/^.+$/gm)

let openCharacters = ['(', '[', '{', '<']
let closeCharacters = [')', ']', '}', '>']

let isOpenCharacter = character => openCharacters.includes(character)

let isCloseCharacter = character => closeCharacters.includes(character)

let getMatchingCloseCharacter = (openCharacter) => {
  if (openCharacter == '(') {
    return ')'
  } else if (openCharacter == '[') {
    return ']'
  } else if (openCharacter == '{') {
    return '}'
  } else if (openCharacter == '<') {
    return '>'
  }

  return '?'
}

let checkChunk = chunk => {
  var openCharacters = []

  for (var i = 0; i < chunk.length; i++) {
    let character = chunk[i]

    if (isOpenCharacter(character)) {
      openCharacters.push(character)
    } else if (isCloseCharacter(character)) {
      if (openCharacters.length == 0) {
        return { valid: false, position: i, type: 'unexpectedCloseCharacter', invalidCharacter: character, message: `Found closing character '${character}' but was expecting an opening character.` }
      } else {
        let previousOpenCharacter = openCharacters.pop()
        let expectedCloseCharacter = getMatchingCloseCharacter(previousOpenCharacter)

        if (character != expectedCloseCharacter) {
          return { valid: false, position: i, type: 'invalidCloseCharacter', invalidCharacter: character, message: `Found closing character '${character}' but was expecting '${expectedCloseCharacter}'.` }
        }
      }
    } else {
      return { valid: false, position: i, type: 'invalidCharacter', invalidCharacter: character, message: `Invalid character '${character}' found.` }
    }
  }

  return { valid: true }
}

let scoreInvalidCharacter = character => {
  if (character == ')') {
    return 3
  } else if (character == ']') {
    return 57
  } else if (character == '}') {
    return 1197
  } else if (character == '>') {
    return 25137
  } else {
    return 0
  }
}

let processInput = input => {
  let scoreLine = line => {
    let result = checkChunk(line)

    if (!result.valid && result.type == 'invalidCloseCharacter') {
      return scoreInvalidCharacter(result.invalidCharacter)
    }

    return 0
  }

  return input.reduce((p, c) => p + scoreLine(c), 0)
}

let input = parseInput(fs.readFileSync('input.txt').toString())
let answer = processInput(input)

console.log(`Answer: ${answer}`)