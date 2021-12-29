let fs = require('fs');

let parseInput = input => input.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('')

let parsePacketVersion = data => parseInt(data.slice(0, 3), 2)
let parsePacketTypeId = data => parseInt(data.slice(3, 6), 2)

let parsePacket = data => {
  var packet = {}

  let parsePacketLookup = {
    '4': parseLiteralValuePacket
  }

  packet.version = parsePacketVersion(data)
  packet.typeId = parsePacketTypeId(data)
  packet.length = 6

  let parseFunction = parsePacketLookup[packet.typeId.toString()]

  if (parseFunction) {
    parseFunction(packet, data)
  } else {
    parseOperatorPacket(packet, data)
  }

  if (packet.length % 4 > 0) {
    packet.length += 4 - (packet.length % 4)
  }

  return packet
}

let parseSubPacket = data => {
  var subPacket = {}

  subPacket.version = parsePacketVersion(data)
  subPacket.typeId = parsePacketTypeId(data)
  subPacket.length = 6

  if (subPacket.typeId == 4) {
    parseLiteralValuePacket(subPacket, data)
  } else {
    parseOperatorPacket(subPacket, data)
  }

  return subPacket
}

let parseLiteralValuePacket = (packet, data) => {
  var groups = []
  var payloadIndex = 6

  do {
    var groupPayload = data.slice(payloadIndex, payloadIndex + 5)
    var lastGroup = groupPayload[0] === '0'
    groups.push(groupPayload.slice(1, 5))
    payloadIndex += 5
  } while (!lastGroup)

  var dataLength = 6 + (groups.length * 5)
  packet.length = dataLength
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
      var subPacket = parseSubPacket(subPacketData.slice(subPacketDataPointer))
      packet.subPackets.push(subPacket)
      subPacketDataPointer += subPacket.length
    }
  } else {
    packet.subPacketCount = parseInt(data.slice(7, 18), 2)
    packet.subPackets = []
    var subPacketDataPointer = 6 + 1 + 11

    for (var i = 0; i < packet.subPacketCount; i++) {
      var subPacket = parseSubPacket(data.slice(subPacketDataPointer))
      packet.subPackets.push(subPacket)
      subPacketDataPointer += subPacket.length
    }

    packet.length = 6 + 1 + 11 + packet.subPackets.reduce((p, c) => p + c.length, 0)
  }

  return packet
}

let parsePackets = data => {
  var packets = []

  while (data.length > 0) {
    var packet = parsePacket(data)
    packets.push(packet)
    data = data.slice(packet.length)
  }

  return packets
}

let versionReducer = (previousValue, currentValue) => {
  previousValue += currentValue.version

  if (currentValue.subPackets) {
    previousValue += currentValue.subPackets.reduce(versionReducer, 0)
  }

  return previousValue
}

let calculateAnswer = packets => {
  return packets.reduce(versionReducer, 0)
}

let input = parseInput(fs.readFileSync('input.txt').toString())

let packets = parsePackets(input)
let answer = calculateAnswer(packets)

console.log(`Answer: ${answer}`)

