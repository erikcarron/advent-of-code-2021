let fs = require('fs');

let parseInput = input => {
  let lines = input.match(/^.+$/gm)
  return lines.map(l => l.split('').map(x => parseInt(x, 10)))
}

let mapSize = map => map.length
let isLegalPoint = (point, mapSize) => (point.x >= 0) && (point.x < mapSize) && (point.y >= 0) && (point.y < mapSize)
let upPoint = point => ({ x: point.x, y: point.y - 1 })
let downPoint = point => ({ x: point.x, y: point.y + 1 })
let rightPoint = point => ({ x: point.x + 1, y: point.y })
let leftPoint = point => ({ x: point.x - 1, y: point.y })
let toPointKey = point => `${point.x},${point.y}`
let fromPointKey = key => {
  var values = key.split(',')
  return {
    x: parseInt(values[0], 10),
    y: parseInt(values[1], 10)
  }
}
let wrapRisk = risk => risk > 9 ? risk % 9 : risk

let calculateRisks = (map, startPosition) => {
  let size = mapSize(map)
  var pointsToCheck = []
  var risks = {}

  risks[toPointKey(startPosition)] = { risk: 0, lowestNeightborRisk: 0 };

  var neighborPoints = []
  neighborPoints.push(upPoint(startPosition))
  neighborPoints.push(downPoint(startPosition))
  neighborPoints.push(leftPoint(startPosition))
  neighborPoints.push(rightPoint(startPosition))

  neighborPoints
    .filter(p => isLegalPoint(p, size))
    .forEach(p => pointsToCheck.push(toPointKey(p)))

  while (pointsToCheck.length > 0) {
    var point = fromPointKey(pointsToCheck.shift())
    var neighborPoints = []

    neighborPoints.push(upPoint(point))
    neighborPoints.push(downPoint(point))
    neighborPoints.push(leftPoint(point))
    neighborPoints.push(rightPoint(point))

    var neighborsWithRisk = neighborPoints.filter(p => isLegalPoint(p, size) && risks[toPointKey(p)] != undefined)
    var lowestNeightborRisk = neighborsWithRisk.reduce((p, c) => Math.min(risks[toPointKey(c)].risk, p), 9999999)

    risks[toPointKey(point)] = { risk: lowestNeightborRisk + map[point.y][point.x], lowestNeightborRisk: lowestNeightborRisk }

    neighborPoints
      .filter(p => isLegalPoint(p, size) && risks[toPointKey(p)] == undefined && !pointsToCheck.includes(toPointKey(p)))
      .forEach(p => pointsToCheck.push(toPointKey(p)))
  }

  var betterPathsFound = false

  do {
    betterPathsFound = false

    Object.getOwnPropertyNames(risks).forEach(k => {
      var point = fromPointKey(k)
      var neighborPoints = []
      neighborPoints.push(upPoint(point))
      neighborPoints.push(downPoint(point))
      neighborPoints.push(leftPoint(point))
      neighborPoints.push(rightPoint(point))

      var validNeighbors = neighborPoints.filter(p => isLegalPoint(p, size))
      var lowestNeightborRisk = validNeighbors.reduce((p, c) => Math.min(risks[toPointKey(c)].risk, p), 9999999)

      if (risks[k].lowestNeightborRisk > lowestNeightborRisk) {
        betterPathsFound = true
        risks[k].lowestNeightborRisk = lowestNeightborRisk
        risks[k].risk = lowestNeightborRisk + map[point.y][point.x]
      }
    })
  } while (betterPathsFound)

  return risks
}

let duplicateMap = map => {
  let size = mapSize(map)
  let dupMapSize = size * 5

  var dupMap = [dupMapSize]

  for (var i = 0; i < dupMapSize; i++) {
    dupMap[i] = [dupMapSize]
  }

  for (var dupY = 0; dupY < 5; dupY++) {
    for (var dupX = 0; dupX < 5; dupX++) {
      for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
          dupMap[(size * dupY) + y][(size * dupX) + x] = wrapRisk(map[y][x] + dupY + dupX)
        }
      }
    }
  }

  return dupMap
}

let map = parseInput(fs.readFileSync('input.txt').toString())
let dupMap = duplicateMap(map)
let risks = calculateRisks(dupMap, { x: 0, y: 0 })

let size = mapSize(dupMap)
let lowestRisk = risks[toPointKey({ x: size - 1, y: size - 1 })].risk

console.log(`Answer: ${lowestRisk}`)
