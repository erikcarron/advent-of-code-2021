let fs = require('fs');

let parseInput = input => input.match(/^.+$/gm).map(v => v.split('').map(n => parseInt(n, 10)))

let getRightLocation = (heatmap, x, y) => {
  let rightX = x + 1
  let rightY = y

  if (rightX < heatmap[0].length) {
    return {
      x: rightX,
      y: rightY,
      value: heatmap[rightY][rightX]
    }
  }
}

let getLeftLocation = (heatmap, x, y) => {
  let leftX = x - 1
  let leftY = y

  if (leftX >= 0) {
    return {
      x: leftX,
      y: leftY,
      value: heatmap[leftY][leftX]
    }
  }
}

let getUpLocation = (heatmap, x, y) => {
  let upX = x
  let upY = y - 1

  if (upY >= 0) {
    return {
      x: upX,
      y: upY,
      value: heatmap[upY][upX]
    }
  }
}

let getDownLocation = (heatmap, x, y) => {
  let downX = x
  let downY = y + 1

  if (downY < heatmap.length) {
    return {
      x: downX,
      y: downY,
      value: heatmap[downY][downX]
    }
  }
}

let isLowpoint = (heatmap, x, y) => {
  let value = heatmap[y][x]

  let upLocation = getUpLocation(heatmap, x, y)
  let rightLocation = getRightLocation(heatmap, x, y)
  let downLocation = getDownLocation(heatmap, x, y)
  let leftLocation = getLeftLocation(heatmap, x, y)

  if (upLocation && upLocation.value <= value) {
    return false
  }

  if (rightLocation && rightLocation.value <= value) {
    return false
  }

  if (downLocation && downLocation.value <= value) {
    return false
  }

  if (leftLocation && leftLocation.value <= value) {
    return false
  }

  return true
}

let findLowPoints = heatmap => {
  var lowPoints = []

  for (var y = 0; y < heatmap.length; y++) {
    for (var x = 0; x < heatmap[y].length; x++) {
      let lowpoint = isLowpoint(heatmap, x, y)

      if (lowpoint) {
        lowPoints.push({ x: x, y: y, value: heatmap[y][x] })
      }
    }
  }

  return lowPoints
}

let findBasin = (heatmap, x, y) => {
  var locations = []
  var locationsToClimb = []
  var checkedLocations = []

  locationsToClimb.push({ x: x, y: y })
  checkedLocations.push(`${x},${y}`)

  while (locationsToClimb.length > 0) {
    let locationToCheck = locationsToClimb.pop()
    locations.push({ x: locationToCheck.x, y: locationToCheck.y })

    let upLocation = getUpLocation(heatmap, locationToCheck.x, locationToCheck.y)

    if (upLocation && !checkedLocations.includes(`${upLocation.x},${upLocation.y}`) && upLocation.value != 9) {
      locationsToClimb.push(upLocation)
      checkedLocations.push(`${upLocation.x},${upLocation.y}`)
    }

    let rightLocation = getRightLocation(heatmap, locationToCheck.x, locationToCheck.y)

    if (rightLocation && !checkedLocations.includes(`${rightLocation.x},${rightLocation.y}`) && rightLocation.value != 9) {
      locationsToClimb.push(rightLocation)
      checkedLocations.push(`${rightLocation.x},${rightLocation.y}`)
    }

    let downLocation = getDownLocation(heatmap, locationToCheck.x, locationToCheck.y)

    if (downLocation && !checkedLocations.includes(`${downLocation.x},${downLocation.y}`) && downLocation.value != 9) {
      locationsToClimb.push(downLocation)
      checkedLocations.push(`${downLocation.x},${downLocation.y}`)
    }

    let leftLocation = getLeftLocation(heatmap, locationToCheck.x, locationToCheck.y)

    if (leftLocation && !checkedLocations.includes(`${leftLocation.x},${leftLocation.y}`) && leftLocation.value != 9) {
      locationsToClimb.push(leftLocation)
      checkedLocations.push(`${leftLocation.x},${leftLocation.y}`)
    }
  }

  return locations
}

let heatmap = parseInput(fs.readFileSync('input.txt').toString())
let lowPoints = findLowPoints(heatmap)
let basins = lowPoints.map(l => findBasin(heatmap, l.x, l.y))
basins.sort((e1, e2) => e2.length - e1.length)
let answer = basins[0].length * basins[1].length * basins[2].length

console.log(`Answer: ${answer}`)