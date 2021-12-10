let colors = require('colors');
let fs = require('fs');

let parseVents = input => {
  let lines = input.split('\r\n')
  let pattern = /^(\d+),(\d+) -> (\d+),(\d+)$/mi
  return lines.map(l => {
    let match = l.match(pattern)
    return {
      start: {
        x: parseInt(match[1], 10),
        y: parseInt(match[2], 10),
      },
      end: {
        x: parseInt(match[3], 10),
        y: parseInt(match[4], 10),
      }
    }
  })
}

let isHorizontal = (vent) => vent.start.y == vent.end.y

let isVertical = (vent) => vent.start.x == vent.end.x

let getPointsForVent = (vent) => {
  if (isHorizontal(vent)) {
    let points = new Array(Math.abs(vent.start.x - vent.end.x) + 1).fill(undefined)
    let direction = vent.start.x < vent.end.x ? 1 : -1
    return points.map((e, i) => ({ x: vent.start.x + (i * direction), y: vent.start.y }))
  } else if (isVertical(vent)) {
    let points = new Array(Math.abs(vent.start.y - vent.end.y) + 1).fill(undefined)
    let direction = vent.start.y < vent.end.y ? 1 : -1
    return points.map((e, i) => ({ x: vent.start.x, y: vent.start.y + (i * direction) }))
  } else {
    let points = new Array(Math.abs(vent.start.x - vent.end.x) + 1).fill(undefined)
    let xDirection = vent.start.x < vent.end.x ? 1 : -1
    let yDirection = vent.start.y < vent.end.y ? 1 : -1
    return points.map((e, i) => ({ x: vent.start.x + (i * xDirection), y: vent.start.y + (i * yDirection) }))
  }
}

let addVentToGrid = (grid, vent) => {
  let points = getPointsForVent(vent)
  points.forEach(p => {
    let key = `${p.x},${p.y}`
    if (grid[key]) {
      grid[key].count++
    } else {
      grid[key] = { count: 1 }
    }
  })
}

let addVentsToGrid = (grid, vents) => {
  vents.forEach(v => addVentToGrid(grid, v))
}

let vents = parseVents(fs.readFileSync('input.txt').toString())
let grid = {}

addVentsToGrid(grid, vents)

var multipleLines = Object.getOwnPropertyNames(grid).filter(p => grid[p].count > 1)
console.log(`Answer: ${multipleLines.length}`)