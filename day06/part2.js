let fs = require('fs');

let parseInput = input => input.split(',').map(input => parseInt(input, 10))

let lookupValue = (lookup, internalTimer, days, calculate) => {
    let key = `${internalTimer},${days}`
    var value = lookup[key]
    if (value != undefined) {
      return value
    } else {
      value = calculate(lookup, internalTimer, days)
      lookup[key] = value
      return value
    }
}

let calculateLanternfishSpawned = (lookup, internalTimer, days) => {
  var days = days + (6 - internalTimer)

  if (days < 1) {
    return BigInt(0)
  }

  let numberSpawned = BigInt(Math.floor(days / 7))
  var total = numberSpawned

  for (var i = 1; i <= numberSpawned; i++) {
    total += lookupValue(lookup, 8, (days - (7 * i)), calculateLanternfishSpawned)
  }

  return total
}

let lanternfish = parseInput(fs.readFileSync('input.txt').toString())
let lookup = {}
let days = 256
let answer = BigInt(lanternfish.length) + lanternfish.reduce((p, c) => p + lookupValue(lookup, c, days, calculateLanternfishSpawned), BigInt(0))
console.log(`Answer: ${answer}`)