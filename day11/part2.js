let fs = require('fs');
let colors = require('colors');

let parseInput = input => input.match(/^.+$/gm).map(i => i.split('').map(n => parseInt(n, 10)))

let printOctopuses = octopuses => {
  octopuses.forEach(i => console.log(i.map(n => n == 0 ? colors.brightGreen(n.toString()) : n.toString()).join('')))
  console.log()
}

let increaseEnergyLevels = octopuses => {
  for (var y = 0; y < octopuses.length; y++) {
    for (var x = 0; x < octopuses[y].length; x++) {
      octopuses[y][x]++
    }
  }
}

let executeFlash = octopuses => {
  var flashCount = 0

  while (anyReadyToFlash(octopuses)) {
    for (var y = 0; y < octopuses.length; y++) {
      for (var x = 0; x < octopuses[y].length; x++) {
        if (readyToFlash(octopuses[y][x])) {
          flashCount++
          octopuses[y][x] = 0
          increaseAdjacent(octopuses, x, y)
        }
      }
    }
  }

  return flashCount
}

let increaseAdjacent = (octopuses, x, y) => {
  let width = octopuses[0].length
  let height = octopuses.length

  for (var yOffset = -1; yOffset <= 1; yOffset++) {
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      let adjacentX = x + xOffset
      let adjacentY = y + yOffset

      if (adjacentX >= 0 && adjacentX < width && adjacentY >= 0 && adjacentY < height && (adjacentX != x || adjacentY != y) && !alreadyFlashed(octopuses[adjacentY][adjacentX])) {
        octopuses[adjacentY][adjacentX]++
      }
    }
  }
}

let readyToFlash = octopus => octopus > 9
let alreadyFlashed = octopus => octopus == 0
let anyReadyToFlash = octopuses => octopuses.some(y => y.some(x => readyToFlash(x)))
let allFlashed = octopuses => octopuses.every(y => y.every(x => alreadyFlashed(x)))

let processStep = octopuses => {
  increaseEnergyLevels(octopuses)
  return executeFlash(octopuses)
}

let findAllFlash = octopuses => {
  var step = 0;

  while (!allFlashed(octopuses)) {
    processStep(octopuses)
    step++
  }

  return step
}

let octopuses = parseInput(fs.readFileSync('input.txt').toString())

printOctopuses(octopuses)

let answer = findAllFlash(octopuses)

printOctopuses(octopuses)

console.log(`Answer: ${answer}`)