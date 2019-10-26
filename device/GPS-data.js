
const SerialPort = require('serialport')
const parsers = SerialPort.parsers
const GPS = require('gps')

const gps = new GPS
var file = '/dev/ttyS0'
const interval = 5 //every x sec

// SerialPort.list(function (err, ports) {
//   console.log(ports);
// })

const parser = new parsers.Readline({
  delimiter: '\r\n'
})

const port = new SerialPort(file, {
  baudRate: 9600
})

port.pipe(parser)

const getGPS = () => {

    const packet = {
        time: gps.state.time,
        lat: gps.state.lat,
        lon: gps.state.lon,
        alt: gps.state.alt,
        speed: gps.state.speed,  
        processedLines: gps.state.processed,
    }
    console.log(packet)
}

//set interval to get GPS data
setInterval(getGPS,interval*1000)

parser.on('data', function(data) {
  gps.update(data)
})
