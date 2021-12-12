let fs = require('fs');

let parseInput = input => input.split(',').map(input => parseInt(input, 10))

let simulateDay = lanternfish => {
  var newLanternfish = []

  for (var i = 0; i < lanternfish.length; i++) {
    lanternfish[i]--
    if (lanternfish[i] < 0) {
      lanternfish[i] = 6;
      newLanternfish.push(8)
    }
  }

  return lanternfish.concat(newLanternfish)
}

let simulateDays = (lanternfish, days) => {
  for (var day = 0; day < days; day++) {
    lanternfish = simulateDay(lanternfish)
  }

  return lanternfish
}

var lanternfish = parseInput(fs.readFileSync('input.txt').toString())

lanternfish = simulateDays(lanternfish, 80)
console.log(`Answer: ${lanternfish.length}`)