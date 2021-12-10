var fs = require('fs')

let parseReport = input => input.split("\r\n").map(parseBinaryNumber)

let parseBinaryNumber = input => input.split('').map(x => parseInt(x, 10))

let mostCommon = v => {
    let bitCount = v.reduce((p, c) => p + c, 0)
    return (bitCount * 2) >= v.length ? 1 : 0
}

let leastCommon = v => {
    let bitCount = v.reduce((p, c) => p + c, 0)
    return (bitCount * 2) >= v.length ? 0 : 1
}

let getColumn = (report, position) => report.map(v => v[position])

let findOxygenGeneratorRating = (report) => {
    let bitCount = report[0].length

    for (var bitPosition = 0; bitPosition < bitCount; bitPosition++) {
        let commonValue = mostCommon(getColumn(report, bitPosition))
        report = report.filter(v => v[bitPosition] == commonValue)

        if (report.length == 1) {
            return parseInt(report[0].join(''), 2)
        }
    }
}

let findCo2ScrubberRating = (report) => {
    let bitCount = report[0].length

    for (var bitPosition = 0; bitPosition < bitCount; bitPosition++) {
        let commonValue = leastCommon(getColumn(report, bitPosition))
        report = report.filter(v => v[bitPosition] == commonValue)

        if (report.length == 1) {
            return parseInt(report[0].join(''), 2)
        }
    }
}

let report = parseReport(fs.readFileSync('input.txt').toString())

let oxygenGeneratorRating = findOxygenGeneratorRating(report)
let co2ScrubberRating = findCo2ScrubberRating(report)

console.log(`Oxygen generator rating: ${oxygenGeneratorRating}`)
console.log(`CO2 scrubber rating: ${co2ScrubberRating}`)
console.log(`Answer: ${oxygenGeneratorRating * co2ScrubberRating}`)