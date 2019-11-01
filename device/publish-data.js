/*
 * @Author: florence.pfammatter 
 * @Date: 2019-11-01 14:41:50 
 * @Last Modified by: florence.pfammatter
 * @Last Modified time: 2019-11-01 14:59:46
 */

//Require MAM package from iota.js
const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

//GPS setup
const GPS = require('gps')
const gps = new GPS //create GPS state object

//Interval of getting GPS data
const interval = 15 //every x sec

//Serial port setup
const SerialPort = require('serialport')
const parsers = SerialPort.parsers

//Port address
const file = '/dev/ttyS0'

const parser = new parsers.Readline({
    delimiter: '\r\n'
  })
  
const port = new SerialPort(file, {
  baudRate: 9600
})

port.on('error', function(err) {
  console.log(`Error with port configuration: \n${err}\nExit program`)
  process.exit(1)
})

//Parse data from port
port.pipe(parser)

//MAM set up
const mode = 'restricted'
const sideKey = 'HELLOCANYOUHEARME'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

//Put your own seed here 
const seed = '9XBAZWXXJ9OUZOC9JMVMLEOBJZVHOJGTJZIEBFGMKVXBHDECWVNEYNZZQPVVCXVGDCUQVWDYVYZPLIXMW'

//Initialise MAM state
let mamState = Mam.init(provider,seed)
mamState = Mam.changeMode(mamState, mode, sideKey)

//Publishes mam message
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
    console.log(`Address: ${message.address}`)
    console.log(`State: ${message.state}\n`)
    return message.root
}

//Get GPS data and publish to tangle
const publishGPS = async () => { 
  if(gps.state.lat){ //checks if GPS signal is available
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

  } else console.log(`No GPS-signal... Will try again in ${interval} seconds.`)
}

//set interval to publish data
setInterval(publishGPS,interval*1000)

//Update GPS state object when data available
parser.on('data', function(data) {
    gps.update(data)
  })

