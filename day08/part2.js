let fs = require('fs');

let parseInput = input => input.match(/^.+$/gm).map(v => parseEntry(v))

let parseEntry = input => {
  let parts = input.split('|')
  let part1 = parts[0].trim()
  let part2 = parts[1].trim()

  let patterns = part1.split(' ').map(p => sortPattern(p))
  let output = part2.split(' ').map(p => sortPattern(p))
  return { patterns: patterns, output: output }
}

let explodePattern = pattern => pattern.split('')
let joinPattern = pattern => pattern.join('')
let sortPattern = pattern => joinPattern(explodePattern(pattern).sort())

let determineMapping = entry => {
  let mapping = new Array(10)
  let explodedPatterns = entry.patterns.map(p => explodePattern(p))

  let findZeroPattern = (patterns, topRightSegment, bottomLeftSegment) => patterns.filter(p => p.length == 6).find(p => p.includes(topRightSegment) && p.includes(bottomLeftSegment))
  let findOnePattern = patterns => patterns.find(p => p.length == 2)
  let findTwoPattern = (patterns, bottomLeftSegment) => patterns.filter(p => p.length == 5).find(p => p.includes(bottomLeftSegment))
  let findThreePattern = (patterns, sevenPattern) => patterns.filter(p => p.length == 5).find(p => sevenPattern.every(s => p.includes(s)))
  let findFourPattern = patterns => patterns.find(p => p.length == 4)
  let findFivePattern = (patterns, sixPattern) => patterns.filter(p => p.length == 5).find(p => p.every(s => sixPattern.includes(s)))
  let findSixPattern = (patterns, sevenPattern) => patterns.filter(p => p.length == 6).find(p => sevenPattern.some(s => !p.includes(s)))
  let findSevenPattern = patterns => patterns.find(p => p.length == 3)
  let findEightPattern = patterns => patterns.find(p => p.length == 7)
  let findNinePattern = (patterns, fourPattern) => patterns.filter(p => p.length == 6).find(p => fourPattern.every(s => p.includes(s)))

  let findTopRightSegment = (onePattern, sixPattern) => onePattern.find(s => !sixPattern.includes(s))
  let findBottomLeftSegment = (ninePattern, eightPattern) => eightPattern.find(s => !ninePattern.includes(s))

  mapping[1] = findOnePattern(explodedPatterns)
  mapping[4] = findFourPattern(explodedPatterns)
  mapping[7] = findSevenPattern(explodedPatterns)
  mapping[8] = findEightPattern(explodedPatterns)
  mapping[6] = findSixPattern(explodedPatterns, mapping[7])
  mapping[9] = findNinePattern(explodedPatterns, mapping[4])
  mapping[3] = findThreePattern(explodedPatterns, mapping[7])
  mapping[5] = findFivePattern(explodedPatterns, mapping[6])

  let topRightSegment = findTopRightSegment(mapping[1], mapping[6])
  let bottomLeftSegment = findBottomLeftSegment(mapping[9], mapping[8])

  mapping[2] = findTwoPattern(explodedPatterns, bottomLeftSegment)
  mapping[0] = findZeroPattern(explodedPatterns, topRightSegment, bottomLeftSegment)

  return mapping.map(m => joinPattern(m))
}

let processEntry = entry => {
  var mapping = determineMapping(entry)
  return parseInt(entry.output.map(x => mapping.indexOf(x).toString()).join(''), 10)
}

let processEntries = entries => entries.map(e => processEntry(e))

let entries = parseInput(fs.readFileSync('input.txt').toString())
let outputs = processEntries(entries)
let answer = outputs.reduce((p, c) => p + c, 0)

console.log(`Answer: ${answer}`)