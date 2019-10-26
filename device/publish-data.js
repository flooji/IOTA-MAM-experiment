
const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

//GPS set up
const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const GPS = require('gps')

const gps = new GPS
var file = '/dev/ttyS0'
const interval = 5 //every x sec

const parser = new parsers.Readline({
    delimiter: '\r\n'
  })
  
  const port = new SerialPort(file, {
    baudRate: 9600
  })
  
  port.pipe(parser)

//const Sensor = require('GPS-data.js')

const mode = 'restricted'
const sideKey = 'mysecret'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

const seed = '9XBAZWXXJ9OUZOC9JMVMLEOBJZVHOJGTJZIEBFGMKVXBHDECWVNEYNZZQPVVCXVGDCUQVWDYVYZPLIXMW'

// Initialise MAM state
let mamState = Mam.init(provider,seed)
mamState = Mam.changeMode(mamState, mode, sideKey)

//Publish data to tangle
const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState,trytes)

    // Save new mamState
    mamState = message.state

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    console.log(`Root: ${message.root}\n`)
    return message.root
}

//publish Hash to tangle
const publishGPS = async () => {

    const packet = {
        time: gps.state.time,
        lat: gps.state.lat,
        lon: gps.state.lon,
        alt: gps.state.alt,
        speed: gps.state.speed,  
        processedLines: gps.state.processed,
    }
    console.log(packet)

    const root = await publish({
        message: packet,
        timestamp: (new Date()).toLocaleString()
    })
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
}


//set interval to get GPS data
setInterval(publishGPS,interval*1000)


parser.on('data', function(data) {
    gps.update(data)
  })
  






