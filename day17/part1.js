let fs = require('fs');

let parseInput = input => {
  let pattern = /^target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)$/mi
  let matches = input.match(pattern)

  let targetArea = {
    x: {
      min: parseInt(matches[1], 10),
      max: parseInt(matches[2], 10)
    }, y: {
      min: parseInt(matches[3], 10),
      max: parseInt(matches[4], 10)
    }
  }

  return targetArea
}

let calculateXPosition = (initialPosition, initialVelocity, acceleration, stepNumber) => {
  if (stepNumber <= 0) {
    return initialPosition
  } else if (stepNumber == 1) {
    return initialPosition + initialVelocity
  } else {
    // acceleration stops once we reach zero velocity, so figure out what step that happens.
    let steps = Math.min(stepNumber, (-1 * initialVelocity / acceleration))
    let n = steps - 1
    let x = (initialVelocity * steps) + ((n / 2) * (n + 1) * acceleration)
    return initialPosition + x
  }
}

let calculateYPosition = (initialPosition, initialVelocity, acceleration, stepNumber) => {
  if (stepNumber <= 0) {
    return initialPosition
  } else if (stepNumber == 1) {
    return initialPosition + initialVelocity
  } else {
    let n = stepNumber - 1
    let y = (initialVelocity * stepNumber) + ((n / 2) * (n + 1) * acceleration)
    return initialPosition + y
  }
}

let calculatePosition = (initialPosition, initialVelocity, acceleration, stepNumber) => {
  let x = calculateXPosition(initialPosition.x, initialVelocity.x, acceleration.x, stepNumber)
  let y = calculateYPosition(initialPosition.y, initialVelocity.y, acceleration.y, stepNumber)
  return { x: x, y: y }
}

let inRange = (value, range) => value >= range.min && value <= range.max

let inTarget = (position, target) => inRange(position.x, target.x) && inRange(position.y, target.y)

let findHighestVelocity = (initialPosition, acceleration, target) => {
  // guess and check the max Y we should use.
  let validVelocities = []

  for (var y = 0; y < 200; y++) {
    for (var x = 1; x <= target.x.max; x++) {
      let velocity = { x: x, y: y }
      var step = 0

      do {
        step++
        var stepPosition = calculatePosition(initialPosition, velocity, acceleration, step)

        if (inTarget(stepPosition, target)) {
          validVelocities.push(velocity)
        }
      } while (stepPosition.x <= target.x.max && stepPosition.y >= target.y.min && !inTarget(stepPosition, target))
    }
  }

  return validVelocities.reduce((p, c) => c.y > p.y ? c : p, { x: 0, y: 0 })
}

let findHighestPosition = (initialPosition, initialVelocity, acceleration) => {
  var highestPosition = 0
  var step = 0

  do {
    step++
    var height = calculateYPosition(initialPosition.y, initialVelocity.y, acceleration.y, step)

    if (height > highestPosition) {
      highestPosition = height
    }
  } while (height >= highestPosition)

  return highestPosition
}

let target = parseInput(fs.readFileSync('input.txt').toString())

let initialPosition = { x: 0, y: 0 }
let acceleration = { x: -1, y: -1 }

let highestVelocity = findHighestVelocity(initialPosition, acceleration, target)
let highestPosition = findHighestPosition(initialPosition, highestVelocity, acceleration)

console.log(`Answer: ${highestPosition}`)
