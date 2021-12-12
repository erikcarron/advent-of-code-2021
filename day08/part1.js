let fs = require('fs');

let parseInput = input => input.match(/^.+$/gm).map(v => parseEntry(v))

let parseEntry = input => {
  let parts = input.split('|')
  let part1 = parts[0].trim()
  let part2 = parts[1].trim()

  let patterns = part1.split(' ')
  let output = part2.split(' ')
  return { patterns: patterns, output: output }
}

let isOneDigit = value => value.length == 2
let isFourDigit = value => value.length == 4
let isSevenDigit = value => value.length == 3
let isEightDigit = value => value.length == 7

let isUniqueSegment = value => isOneDigit(value) || isFourDigit(value) || isSevenDigit(value) || isEightDigit(value)

var entries = parseInput(fs.readFileSync('input.txt').toString())

let uniqueDigitCount = entries.reduce((p, c) => p + c.output.filter(v => isUniqueSegment(v)).length, 0)
console.log(`Answer: ${uniqueDigitCount}`)