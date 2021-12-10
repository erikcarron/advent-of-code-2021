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

let values = parseInput(fs.readFileSync('input.txt').toString())
let increaseCount = calculateNumberOfIncreases(values)

console.log(increaseCount)
