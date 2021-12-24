let fs = require('fs');
let colors = require('colors');

let parseInput = input => {
  let lines = input.match(/^.+$/gm)
  let dotPattern = /^(\d+),(\d+)$/mi
  let foldPattern = /^fold along (x|y)=(\d+)$/mi

  var manual = {
    dots: [],
    foldInstructions: [],
    paper: {},
    paperWidth: 0,
    paperHeight: 0
  }

  for (var i = 0; i < lines.length; i++) {
    dotMatch = lines[i].match(dotPattern)
    foldMatch = lines[i].match(foldPattern)

    if (dotMatch) {
      manual.dots.push({ x: parseInt(dotMatch[1], 10), y: parseInt(dotMatch[2], 10) })
    } else if (foldMatch) {
      manual.foldInstructions.push({ direction: foldMatch[1], position: parseInt(foldMatch[2], 10) })
    }
  }

  definePaper(manual)
  manual.paperWidth = paperWidth(manual.dots)
  manual.paperHeight = paperHeight(manual.dots)

  return manual
}

let paperWidth = dots => dots.reduce((p, c) => c.x > p ? c.x : p, 0) + 1
let paperHeight = dots => dots.reduce((p, c) => c.y > p ? c.y : p, 0) + 1

let definePaper = manual => {
  manual.paper = {}

  manual.dots.forEach(d => {
    let key = `${d.x},${d.y}`
    manual.paper[key] = '#'
  })
}

let printPaper = manual => {
  let width = manual.paperWidth
  let height = manual.paperHeight

  var output = new Array(height)

  for (var y = 0; y < height; y++) {
    output[y] = new Array(width)
    output[y].fill('.', 0, width)
  }

  manual.dots.forEach(d => output[d.y][d.x] = colors.brightGreen('#'))
  output.forEach(row => console.log(row.join('')))
  console.log()
}

let foldPaper = (manual) => {
  var newDots = []
  var foldedPaper = {}
  let foldInstruction = manual.foldInstructions.shift()

  if (foldInstruction.direction === 'x') {
    manual.dots.forEach(d => {
      if (d.x < foldInstruction.position) {
        newDots.push(d)
      } else {
        let foldedX = foldInstruction.position - (d.x - foldInstruction.position)
        newDots.push({ x: foldedX, y: d.y })
      }
    })

    manual.paperWidth = Math.floor(manual.paperWidth / 2)
  } else if (foldInstruction.direction === 'y') {
    manual.dots.forEach(d => {
      if (d.y < foldInstruction.position) {
        newDots.push(d)
      } else {
        let foldedY = foldInstruction.position - (d.y - foldInstruction.position)
        newDots.push({ x: d.x, y: foldedY })
      }
    })

    manual.paperHeight = Math.floor(manual.paperHeight / 2)
  }

  manual.dots = newDots
  definePaper(manual)
}

let foldAll = manual => {
  while (manual.foldInstructions.length > 0) {
    foldPaper(manual)
  }
}

let input = parseInput(fs.readFileSync('input.txt').toString())

foldAll(input)
printPaper(input)