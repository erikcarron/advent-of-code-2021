let fs = require('fs');

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

  if (openCharacters.length > 0) {
    return { valid: false, position: i, type: 'incomplete', missingCloseCharacters: openCharacters.reverse().map(c => getMatchingCloseCharacter(c)), message: `The chunk is incomplete.` }
  }

  return { valid: true }
}

let scoreClosingCharacter = character => {
  if (character == ')') {
    return 1
  } else if (character == ']') {
    return 2
  } else if (character == '}') {
    return 3
  } else if (character == '>') {
    return 4
  } else {
    return 0
  }
}

let scoreClosingString = string => string.reduce((p, c) => (p * 5) + scoreClosingCharacter(c), 0)
let scoreClosingStrings = strings => strings.map(s => scoreClosingString(s))
let sortScores = scores => scores.sort((a, b) => a - b)
let findMiddleScore = scores => sortScores(scores)[Math.floor(scores.length / 2)]


let processInput = input => {
  let chunkStatus = input.map(i => checkChunk(i))
  let incomplete = chunkStatus.filter(i => i.type === 'incomplete')
  let scores = scoreClosingStrings(incomplete.map(i => i.missingCloseCharacters))
  return findMiddleScore(scores)
}

let input = parseInput(fs.readFileSync('input.txt').toString())
let answer = processInput(input)

console.log(`Answer: ${answer}`)