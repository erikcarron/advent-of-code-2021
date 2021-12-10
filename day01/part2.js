let fs = require('fs')

let parseInput = input => input.match(/^.+$/gm).map(v => parseInt(v, 10))

let increase = (first, second) => second > first

let calculateNumberOfIncreases = data => {
  var increaseCount = 0;

  for (var i = 1; i < data.length; i++) {
    if (increase(data[i - 1], data[i])) {
      increaseCount++
    }
  }

  return increaseCount
}

let window = (data, windowSize) => {
  let windows = new Array(data.length - windowSize + 1)

  for (var i = windowSize - 1; i < data.length; i++) {
    windows[i] = 0

    for (var j = 0; j < windowSize; j++) {
      windows[i] += data[i - j]
    }
  }

  return windows
}

let values = parseInput(fs.readFileSync('input.txt').toString())
let windows = window(values, 3)
let increaseCount = calculateNumberOfIncreases(windows)

console.log(increaseCount)
