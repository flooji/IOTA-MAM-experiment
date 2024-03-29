//GPS setup
const GPS = require('gps')
const gps = new GPS //create GPS state object

//Interval of getting GPS data
const interval = 15 //every x sec

//Serial port configuration
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

//Parse data from port
port.pipe(parser)

console.log(`Serial port ${file} is opened and configured.\nMessages will appear all ${interval} sec. Please wait...`)

//Get single parameters from GPS state object
const getGPS = () => {

let packet = {
	time:   gps.state.time,
        lat:    gps.state.lat,
        lon:    gps.state.lon,
        alt:    gps.state.alt,
        speed:  gps.state.speed,  
        processedLines: gps.state.processed,
    }
    console.log(packet)
}

//Set interval to get GPS data
setInterval(getGPS,interval*1000)

//update GPS state object when data available
parser.on('data', function(data) {
  gps.update(data)
})

port.on('error', function(err) {
  console.log(`Error with port configuration: \n${err}\nExit program`)
  process.exit(1)
})
