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

let step = (template, rules) => {
  var output = []

  for (var i = 0; i < template.length - 1; i++) {
    let pair = template[i].concat(template[i + 1])
    let insert = rules[pair]

    output.push(template[i])

    if (insert) {
      output.push(insert)
    }
  }

  output.push(template[template.length - 1])

  return output.join('')
}

let executeSteps = (template, rules, stepCount) => {
  var stepOutput = template

  for (var i = 1; i <= stepCount; i++) {
    stepOutput = step(stepOutput, rules)
  }

  return stepOutput
}

let calculateAnswer = polymer => {
  let characterReducer = (p, c) => {
    if (p[c]) {
      p[c] += 1
    } else {
      p[c] = 1
    }

    return p
  }
  let characterCount = polymer.split('').reduce(characterReducer, {})
  let counts = Object.getOwnPropertyNames(characterCount).map(c => characterCount[c])
  counts.sort((a, b) => b - a)

  return (counts[0] - counts[counts.length - 1])
}

let instructions = parseInput(fs.readFileSync('input.txt').toString())
let polymer = executeSteps(instructions.template, instructions.rules, 10)
let answer = calculateAnswer(polymer)

console.log(`Answer: ${answer}`)