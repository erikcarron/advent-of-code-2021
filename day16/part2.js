let fs = require('fs');

let parseInput = input => input.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('')

let parsePacketVersion = data => parseInt(data.slice(0, 3), 2)
let parsePacketTypeId = data => parseInt(data.slice(3, 6), 2)

let parsePacket = data => {
  var packet = {}

  let parsePacketLookup = {
    '0': parseSumPacket,
    '1': parseProductPacket,
    '2': parseMinimumPacket,
    '3': parseMaximumPacket,
    '4': parseLiteralValuePacket,
    '5': parseGreaterThanPacket,
    '6': parseLessThanPacket,
    '7': parseEqualToPacket
  }

  packet.version = parsePacketVersion(data)
  packet.typeId = parsePacketTypeId(data)
  packet.length = 6

  let parseFunction = parsePacketLookup[packet.typeId.toString()]

  if (parseFunction) {
    parseFunction(packet, data)
  }

  return packet
}

let parseLiteralValuePacket = (packet, data) => {
  var groups = []
  var dataIndex = 6

  packet.typeName = 'Literal Value'

  do {
    var groupData = data.slice(dataIndex, dataIndex + 5)
    var lastGroup = groupData[0] === '0'
    groups.push(groupData.slice(1, 5))
    dataIndex += 5
  } while (!lastGroup)

  packet.length = 6 + (groups.length * 5)
  packet.value = parseInt(groups.join(''), 2)

  return packet
}

let parseOperatorPacket = (packet, data) => {
  packet.lengthTypeId = parseInt(data.slice(6, 7), 2)

  if (packet.lengthTypeId === 0) {
    packet.subPacketLength = parseInt(data.slice(7, 22), 2)
    packet.length = 6 + 1 + 15 + packet.subPacketLength
    packet.subPackets = []
    var subPacketData = data.slice(6 + 1 + 15, packet.length)
    var subPacketDataPointer = 0

    while (subPacketDataPointer < packet.subPacketLength) {
      var subPacket = parsePacket(subPacketData.slice(subPacketDataPointer))
      packet.subPackets.push(subPacket)
      subPacketDataPointer += subPacket.length
    }
  } else {
    packet.subPacketCount = parseInt(data.slice(7, 18), 2)
    packet.subPackets = []
    var subPacketDataPointer = 6 + 1 + 11

    for (var i = 0; i < packet.subPacketCount; i++) {
      var subPacket = parsePacket(data.slice(subPacketDataPointer))
      packet.subPackets.push(subPacket)
      subPacketDataPointer += subPacket.length
    }

    packet.length = 6 + 1 + 11 + packet.subPackets.reduce((p, c) => p + c.length, 0)
  }

  return packet
}

let parseSumPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Sum Operator'
  packet.value = packet.subPackets.reduce((previousValue, currentValue) => previousValue + currentValue.value, 0)
}

let parseProductPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Product Operator'
  packet.value = packet.subPackets.reduce((previousValue, currentValue) => previousValue * currentValue.value, 1)
}

let parseMinimumPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Minimum Operator'
  packet.value = packet.subPackets.reduce((previousValue, currentValue) => currentValue.value < previousValue ? currentValue.value : previousValue, Number.MAX_SAFE_INTEGER)
}

let parseMaximumPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Maximum Operator'
  packet.value = packet.subPackets.reduce((previousValue, currentValue) => currentValue.value > previousValue ? currentValue.value : previousValue, 0)
}

let parseGreaterThanPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Greater Then Operator'
  packet.value = packet.subPackets[0].value > packet.subPackets[1].value ? 1 : 0
}

let parseLessThanPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Less Then Operator'
  packet.value = packet.subPackets[0].value < packet.subPackets[1].value ? 1 : 0
}

let parseEqualToPacket = (packet, data) => {
  parseOperatorPacket(packet, data)
  packet.typeName = 'Equal To Operator'
  packet.value = packet.subPackets[0].value == packet.subPackets[1].value ? 1 : 0
}

let input = parseInput(fs.readFileSync('input.txt').toString())

let packet = parsePacket(input)
let answer = packet.value

console.log(`Answer: ${answer}`)