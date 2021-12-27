let fs = require('fs');

let parseInput = input => {
  let lines = input.match(/^.+$/gm)
  let rulePattern = /^([a-zA-Z]+) -> ([a-zA-Z]+)$/mi

  var instructions = {}

  instructions.template = lines[0]
  instructions.rules = {}

  for (var i = 1; i < lines.length; i++) {
    let ruleMatch = lines[i].match(rulePattern)

    if (ruleMatch) {
      let pair = ruleMatch[1]
      let insert = ruleMatch[2]
      instructions.rules[pair] = insert
    }
  }

  return instructions
}

let lookupKey = (first, second, stepNumber) => `${first}-${second}+${stepNumber}`

let addToLookup = (lookup, first, second, stepNumber, value) => {
  let key = lookupKey(first, second, stepNumber)
  lookup[key] = value
}

let getFromLookup = (lookup, first, second, stepNumber) => {
  let key = lookupKey(first, second, stepNumber)
  return lookup[key]
}

let getOrAddToLookup = (lookup, first, second, stepNumber, valueFunc) => {
  let key = lookupKey(first, second, stepNumber)
  let value = lookup[key]

  if (value) {
    return value
  } else {
    lookup[key] = valueFunc(lookup, first, second, stepNumber)
  }
}

let getInsertValue = (rules, first, second) => {
  let key = first.concat(second)
  return rules[key]
}

let executeStep = (lookup, first, second, stepNumber, rules) => {
  if (stepNumber == 0) {
    var value = {}
    value[first] = BigInt(1)
    return value
  } else {
    let key = lookupKey(first, second, stepNumber)
    var value = lookup[key]

    if (value) {
      return value
    } else {
      var insertValue = getInsertValue(rules, first, second)

      if (insertValue) {
        let leftValue = executeStep(lookup, first, insertValue, stepNumber - 1, rules)
        let rightValue = executeStep(lookup, insertValue, second, stepNumber - 1, rules)
        value = addCharacterCount(leftValue, rightValue)
      } else {
        console.log('NO HIT!!!!')
        value = {}
        value[first] = BigInt(1)
      }

      lookup[key] = value
      return value
    }
  }
}

let addCharacterCount = (a, b) => {
  var sum = {}

  Object.getOwnPropertyNames(a).forEach(c => {
    if (sum[c]) {
      sum[c] += a[c]
    } else {
      sum[c] = a[c]
    }
  })

  Object.getOwnPropertyNames(b).forEach(c => {
    if (sum[c]) {
      sum[c] += b[c]
    } else {
      sum[c] = b[c]
    }
  })

  return sum
}

let execute = (instructions, stepCount) => {
  var lookup = {}
  var characterCount = {}

  for (var i = 0; i < instructions.template.length - 1; i++) {
    let count = executeStep(lookup, instructions.template[i], instructions.template[i + 1], stepCount, instructions.rules)
    characterCount = addCharacterCount(characterCount, count)
  }

  var lastCharacterCount = {}
  lastCharacterCount[instructions.template[instructions.template.length - 1]] = BigInt(1)
  characterCount = addCharacterCount(characterCount, lastCharacterCount)

  return characterCount
}

let calculateAnswer = characterCounts => {
  let minCount = Object.getOwnPropertyNames(characterCounts).map(c => characterCounts[c]).reduce((p, c) => (c < p ? c : p), BigInt(Number.MAX_SAFE_INTEGER))
  let maxCount = Object.getOwnPropertyNames(characterCounts).map(c => characterCounts[c]).reduce((p, c) => (c > p ? c : p), BigInt(0))
  return maxCount - minCount
}

let instructions = parseInput(fs.readFileSync('input.txt').toString())
let characterCounts = execute(instructions, 40)
let answer = calculateAnswer(characterCounts)
console.log(`Answer: ${answer}`)