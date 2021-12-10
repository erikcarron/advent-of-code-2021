let colors = require('colors');
let fs = require('fs')

let parseBingo = (input, boardSize) => {
  let lines = input.split('\r\n')
  let boardCount = (lines.length - 1) / (boardSize + 1)

  var bingo = {
    numbers: [],
    round: 0,
    boards: new Array(boardCount),
    winOrder: []
  }

  bingo.numbers = parseBingoNumbers(lines[0])

  for (var boardIndex = 0; boardIndex < boardCount; boardIndex++) {
    bingo.boards[boardIndex] = parseBingoBoard(lines.slice(2 + (boardIndex * (boardSize + 1))), boardSize)
  }

  return bingo;
}

let parseBingoNumbers = input => input.split(',').map(x => parseInt(x, 10))

let parseBingoBoard = (input, boardSize) => {
  var board = {
    numbers: new Array(boardSize),
    winner: false
  }

  for (var row = 0; row < boardSize; row++) {
    var boardRow = new Array(boardSize)
    // .filter(Boolean) removes empty items
    let values = input[row].split(' ').filter(Boolean).map(x => parseInt(x, 10))

    for (var column = 0; column < boardSize; column++) {
      boardRow[column] = {
        row: row,
        column: column,
        number: values[column],
        marked: false
      }
    }

    board.numbers[row] = boardRow
  }

  return board
}

let printBingo = bingo => {
  console.log(`Numbers: ${bingo.numbers}`)
  console.log(`Round: ${bingo.round}`)
  console.log(`Winning Order: ${bingo.winOrder}`)
  // bingo.boards.forEach(b => {
  //     console.log()
  //     printBoard(b)
  // })
}

let printBoard = board => {
  board.numbers.forEach(row => {
    let value = r => r.number.toString().padStart(2, ' ')
    console.log(row.map(x => x.marked ? value(x).red : value(x)).join(' '))
  })
}

let isWinningBoard = board => {
  let rowWin = board.numbers.some(row => row.every(x => x.marked))

  if (rowWin) {
    return true
  }

  for (var i = 0; i < board.numbers.length; i++) {
    let columnWin = board.numbers.every(row => row[i].marked)

    if (columnWin) {
      return true
    }
  }

  return false
}

let calculateBoardScore = (board, number) => {
  let rowReducer = (p, c) => c.marked ? p : p + c.number
  let sum = board.numbers.reduce((p, c) => p + c.reduce(rowReducer, 0), 0)
  return sum * number
}

let playBingo = bingo => {
  bingo.round = 0

  for (var round = 0; round < bingo.numbers.length; round++) {
    playBingoRound(bingo)

    if (bingo.boards.some(b => isWinningBoard(b) && !b.winner)) {
      let winningBoard = bingo.boards.findIndex(b => isWinningBoard(b) && !b.winner)
      bingo.boards[winningBoard].winner = true
      bingo.winOrder.push(winningBoard)
    }

    if (bingo.boards.every(b => isWinningBoard(b))) {
      return
    }

    bingo.round++
  }
}

let playBingoRound = bingo => {
  let number = bingo.numbers[bingo.round]

  bingo.boards.forEach(board => {
    board.numbers.forEach(row => {
      row.forEach(column => {
        if (column.number == number) {
          column.marked = true
        }
      })
    })
  })
}

let bingo = parseBingo(fs.readFileSync('input.txt').toString(), 5)

playBingo(bingo)
//printBingo(bingo)

let score = calculateBoardScore(bingo.boards[bingo.winOrder[bingo.winOrder.length - 1]], bingo.numbers[bingo.round])
console.log(`Answer: ${score}`)