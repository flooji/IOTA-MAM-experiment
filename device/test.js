var file = '/dev/ttyS0'

const SerialPort = require('serialport')
const parsers = SerialPort.parsers

const fs = require('fs')

//Interval of getting GPS data
const interval = 15 //every x sec

/*
SerialPort.list(function (err, ports) {
  console.log(ports);
});
 */

const parser = new parsers.Readline({
  delimiter: '\r\n'
})

const port = new SerialPort(file, {
  baudRate: 9600
})

port.pipe(parser)


var GPS = require('gps')
var gps = new GPS

//Get single parameters from GPS state object
const getGPS = () => {

  const packet = {
      time:   gps.state.time,
      lat:    gps.state.lat,
      lon:    gps.state.lon,
      alt:    gps.state.alt,
      speed:  gps.state.speed,  
      processedLines: gps.state.processed,
  }

  // Save new packet
  fs.writeFileSync('gps.json',JSON.stringify(packet))
  console.log(gps.state)
  console.log(packet)
}

gps.on('data', function(data) {
   console.log(gps.state)
 })

parser.on('data', function(data) {
  gps.update(data)
})

getGPS()

//Set interval to get GPS data
setInterval(getGPS,interval*1000)
