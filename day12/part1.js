let fs = require('fs');

let parseInput = input => {
  let lines = input.match(/^.+$/gm)
  let pattern = /^(\w+)-(\w+)$/mi

  return lines.map(l => {
    let match = l.match(pattern)

    return [match[1], match[2]]
  })
}

let createMap = input => {
  let map = {}

  for (var i = 0; i < input.length; i++) {
    let caveOne = input[i][0]
    let caveTwo = input[i][1]

    if (map[caveOne] == undefined) {
      map[caveOne] = { connectedCaves: [caveTwo] }
    } else {
      map[caveOne].connectedCaves.push(caveTwo)
    }

    if (map[caveTwo] == undefined) {
      map[caveTwo] = { connectedCaves: [caveOne] }
    } else {
      map[caveTwo].connectedCaves.push(caveOne)
    }
  }

  return map
}

let isSmallCave = cave => cave === cave.toLowerCase()
let isLargeCave = cave => cave === cave.toUpperCase()

let findPaths = map => {
  var paths = []
  var pathsToCheck = []
  pathsToCheck.push(['start'])

  while (pathsToCheck.length > 0) {
    var pathToCheck = pathsToCheck.shift()
    var lastCave = pathToCheck[pathToCheck.length - 1]

    if (lastCave == 'end') {
      paths.push(pathToCheck)
    } else {
      var connectedCaves = map[lastCave].connectedCaves
      var allowedCaves = connectedCaves.filter(c => isLargeCave(c) || (isSmallCave(c) && !pathToCheck.includes(c)))

      allowedCaves.forEach(c => {
        var newPath = pathToCheck.map(p => p)
        newPath.push(c)
        pathsToCheck.push(newPath)
      })
    }
  }

  return paths
}

let input = parseInput(fs.readFileSync('input.txt').toString())
let map = createMap(input)
let paths = findPaths(map)

let answer = paths.length

console.log(`Answer: ${answer}`)