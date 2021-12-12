let fs = require('fs');

let parseInput = input => input.split(',').map(input => parseInt(input, 10))

let calculateFuel = (from, to) => {
  let distance = Math.abs(from - to)
  return distance / 2 * (distance + 1)
}

let minPosition = positions => Math.min(...positions)

let maxPosition = positions => Math.max(...positions)

let calculateLowestCostPosition = positions => {
  let min = minPosition(positions)
  let max = maxPosition(positions)

  let fuelCalculations = new Array(max)

  for (var i = min; i <= max; i++) {
    fuelCalculations[i] = positions.reduce((p, c) => p + calculateFuel(c, i), 0)
  }

  let minCost = Math.min(...fuelCalculations)
  let minCostPosition = fuelCalculations.indexOf(minCost)
  return { minCost: minCost, postion: minCostPosition }
}

var positions = parseInput(fs.readFileSync('input.txt').toString())

let lowestCostPosition = calculateLowestCostPosition(positions)
console.log(`Answer: ${lowestCostPosition.minCost}`)