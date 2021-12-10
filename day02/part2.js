var fs = require('fs')

let parseCommands = input => input.split("\r\n").map(parseCommand)

let parseCommand = input => {
  let match = input.match(/^(.+) (\d+)$/mi)

  var command = {
    action: match[1],
    units: parseInt(match[2], 10)
  }

  return command
}

let processCommands = commands => {
  var position = { horizontal: 0, depth: 0, aim: 0 }

  for (var i = 0; i < commands.length; i++) {
    let command = commands[i]
    if (command.action == 'forward') {
      position.horizontal += command.units
      position.depth += position.aim * command.units
    } else if (command.action == 'down') {
      position.aim += command.units
    } else if (command.action == 'up') {
      position.aim -= command.units
    }
  }

  return position
}


let commands = parseCommands(fs.readFileSync('input.txt').toString())
let position = processCommands(commands)

console.log(position)
console.log(`Answer: ${position.horizontal * position.depth}`)