const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')
const fs = require('fs')

//GPS set up
const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const GPS = require('gps')

const gps = new GPS
var file = '/dev/ttyS0'
const interval = 15 //every x sec

const parser = new parsers.Readline({
    delimiter: '\r\n'
  })
  
  const port = new SerialPort(file, {
    baudRate: 9600
  })
  
  port.pipe(parser)

const mode = 'restricted'
const sideKey = 'VERYSECRETKEYFORME'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${sideKey.padEnd(81, '9')}&root=`
const seed = 'LHOSEFEJOREBERAKWDFHIWMA9DKGFOEPJBLWWVRTFRZBZSTVOZZWRVWRDDQMKIRYVRFXBQDYNEHAXPTED'

Mam.init(provider,seed)
let stored = fs.readFileSync('mam_state.json','utf8')
console.log('Stored: ',stored)
let mamState = JSON.parse(stored)
console.log('MamState: ',mamState)
Mam.changeMode(mamState, mode, sideKey)

// Publish to tangle
const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

    // Save new mamState
    mamState = message.state
    fs.writeFileSync('mam_state.json',JSON.stringify(mamState))

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)

    console.log('Published', packet, '\n');
    return message.root
}

const publishGPS = async () => {
  let dataObj = {
    time:   gps.state.time,
    lat:    gps.state.lat,
    lon:    gps.state.lon,
    alt:    gps.state.alt,
    speed:  gps.state.speed,  
    processedLines: gps.state.processed,
  }
  const root = await publish({
    message: dataObj,
    timestamp: (new Date()).toLocaleString()
  })

  console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
  console.log('Root: ',root)
  return root
}

//set interval to publish data
setInterval(publishGPS,interval*1000)

  //when data available parse it and update gps-state object
parser.on('data', function(data) {
  gps.update(data)
})