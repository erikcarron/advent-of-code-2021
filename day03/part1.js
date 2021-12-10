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

let findGammaRate = (report) => {
    let bitCount = report[0].length
    var gammaRate = []

    for (var bitPosition = 0; bitPosition < bitCount; bitPosition++) {
        let commonValue = mostCommon(getColumn(report, bitPosition))
        gammaRate.push(commonValue)
    }

    return parseInt(gammaRate.join(''), 2)
}

let findEpsilonRate = (report) => {
    let bitCount = report[0].length
    var epsilonRate = []

    for (var bitPosition = 0; bitPosition < bitCount; bitPosition++) {
        let commonValue = leastCommon(getColumn(report, bitPosition))
        epsilonRate.push(commonValue)
    }

    return parseInt(epsilonRate.join(''), 2)
}

let report = parseReport(fs.readFileSync('input.txt').toString())

let gammaRate = findGammaRate(report);
let epsilonRate = findEpsilonRate(report)

console.log(`Gamma rate: ${gammaRate}`)
console.log(`Epsilon rate: ${epsilonRate}`)
console.log(`Answer: ${gammaRate * epsilonRate}`)