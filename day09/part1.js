let fs = require('fs');

let parseInput = input => input.match(/^.+$/gm).map(v => v.split('').map(n => parseInt(n, 10)))

let isLowpoint = (heatmap, x, y) => {
  let value = heatmap[y][x]
  let height = heatmap.length
  let width = heatmap[0].length

  let topY = y - 1

  if (topY >= 0 && heatmap[topY][x] <= value) {
    return false
  }

  let bottomY = y + 1

  if (bottomY < height && heatmap[bottomY][x] <= value) {
    return false
  }

  let leftX = x - 1

  if (leftX >= 0 && heatmap[y][leftX] <= value) {
    return false
  }

  let rightX = x + 1

  if (rightX < width && heatmap[y][rightX] <= value) {
    return false
  }

  console.log(`X: ${x}  Y: ${y}  Value: ${value}`)
  return true
}

let findLowPoints = heatmap => {
  var lowPoints = []

  for (var y = 0; y < heatmap.length; y++) {
    for (var x = 0; x < heatmap[y].length; x++) {
      let lowpoint = isLowpoint(heatmap, x, y)

      if (lowpoint) {
        lowPoints.push(heatmap[y][x])
      }
    }
  }

  return lowPoints
}

let heatmap = parseInput(fs.readFileSync('input.txt').toString())

let lowPoints = findLowPoints(heatmap)
let riskLevels = lowPoints.map(l => l + 1)
let answer = riskLevels.reduce((p, c) => p + c, 0)

console.log(`Answer: ${answer}`)