# IOTA-MAM-experiment
Publish GPS-data in a restricted channel and fetch the data from the tangle.

:warning: This code was written by a beginner. 

## Table of Contents

- [Getting started](#getting-started)
- [Tutorial](#tutorial)
- [Support](#support)
- [Contributing](#contributing)
- [Credits](#credits)

## Getting started

**Prerequisites**

- Raspberry Pi (I used the model 3B+) with internet connection
- GNSS-Module [SAM-M8Q](https://www.u-blox.com/en/product/sam-m8q-module) from u-blox
- [NodeJS](https://nodejs.org/en/) installed on your Raspi


**Installation**

You can download this repo to your Raspberry Pi and then run ```npm install``` to install all dependencies automatically. 
npm-modules (also visible in package.json-file):
- @iota/mam v.0.7.3
- gps v.0.5.3
- serialport v.7.1.5

To install a npm module run ```npm install module_name```.

## Tutorial

Here's a small tutorial on how to track positional data over the IOTA tangle:

### 1. Get positional data from a GNSS/GPS module

To connect your GNSS/GPS module to the Raspberry Pi you can use [UART (Universal asynchronous receiver-transmitter)](http://www.circuitbasics.com/basics-uart-communication/):

<img src="https://cdn.getfpv.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/g/p/gps-sam-m8q-2-2jpg.jpg" width="300">

Check [this tutorial](https://medium.com/@DefCon_007/using-a-gps-module-neo-7m-with-raspberry-pi-3-45100bc0bb41) to see how GNSS/GPS data from the serial port can be viewed on the Raspberry Pi.

:information_source: If the blue light of the GNSS/GPS module is blinking, you have GNSS reception.


:information_source: If you receive something like ```$GPTXT,01,01,01,NMEA unknown msg*58```, try to turn off the serial echo with ```stty -F /dev/ttyS0 -echo```. It could as well be a short circuit.

### 2. Publish the data to the IOTA tangle

Once you checked with ```cat /dev/ttyS0``` that data is available, you can use this data inside a script.

The script [checkGPS.js](https://github.com/flooji/IOTA-MAM-experiment/blob/master/device/checkGPS.js) uses the npm module [GPS.js](https://www.npmjs.com/package/gps) to parse [NMEA](https://www.gpsworld.com/what-exactly-is-gps-nmea-data/) sentences from the serial port and log them in intervals to the terminal.

This is the data retrieved from the GPS state object: 

```javascript
let packet = {
    time:   gps.state.time,
    lat:    gps.state.lat,
    lon:    gps.state.lon,
    alt:    gps.state.alt, 
    speed:  gps.state.speed,  
    processedLines: gps.state.processed,
}
   ```
If this is working you are ready to publish the positional data to the tangle.
By creating a restricted MAM channel, only people with the appropriate [side key](https://docs.iota.org/docs/client-libraries/0.1/mam/introduction/overview) will be able to see the published data. 

In this tutorial we first create a MAM state object and store it to a file. Like this the MAM state object will not be re-initialized in case the script execution crashes. I chose this solution as a hack to not overwrite old messages by re-using addresses. 
Use [mam_setup.js](https://github.com/flooji/IOTA-MAM-experiment/blob/master/device/mam-setup.js) to setup the MAM state. Change seed and side key to your own. Do not use a seed that you use for other purposes. You can generate a new seed with ```cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}```.

:warning: Please be aware that this is NOT a safe way on how to treat your seed. However, since we are only operating on the [devnet](https://devnet.thetangle.org/), no actual IOTAs can be lost. 

The MAM state object will look something like this:
```javascript 
{
  "subscribed":[],
  "channel":{
    "side_key":"MYSIDEKEY9999999999999999999999999999999999999999999999999999999999999999",
    "mode":"restricted",
    "next_root":null,
    "security":2,
    "start":0,
    "count":1,
    "next_count":1,
    "index":0
  },
  "seed":"PHERELRURUYOJHR9KHTOESXYZTAIHIFRQSPAKNXBIIUIHRDZJQBIJVGIQYLXGVJELZZNDFYPKKR9JXEKO"
}
```
As you can see, the start is at zero. Every published MAM message the index is increased by one. 

In [tracking.js](https://github.com/flooji/IOTA-MAM-experiment/blob/master/device/tracking.js) the data packages are finally published to the tangle. 
First the mam state object is initialized and then changed to the one in the file. Then the data from the serial port is parsed and then 
published to the tangle with 
```javascript 
await Mam.attach(message.payload, message.address, 3, 9) 
```
If no GNSS data is available publishing will be skipped. 

### 3. Fetch the data from the IOTA tangle

To fetch data from a restricted MAM channel you need a root and the side key of the channel. 
The actual fetch is performed with this statement: 
```javascript
await Mam.fetch(root, mode).then(data => {
    
    data.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
    
}
```
This will fetch the entire MAM channel starting from the given root. Depending on the number of messages this can take quite a while. An alternative method is to fetch the data and log it with a callback function (getCoordinate) like this:

```javascript
await Mam.fetch(root,mode,sideKey,getCoordinate)
```
If you would like to view the fetched data on a webpage use [weblogger.js](https://github.com/flooji/IOTA-MAM-experiment/blob/master/observer/webLogger.js) which followed the example of [this official IOTA tutorial](https://docs.iota.org/docs/client-libraries/0.1/mam/js/create-mam-webpage).

Next step would be to display this data on a map. I made a first example of that in my other repository [IOTA-GPS-Tracker](https://github.com/flooji/IOTA-GPS-Tracker).

## Support

Please [open an issue](https://github.com/flooji/IOTA-Raspberry-API/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/flooji/IOTA-Raspberry-API/compare/).

## Credits

Credits to the IOTA foundation whose [tutorials](https://docs.iota.org/docs/client-libraries/0.1/mam/js/create-restricted-channel) helped me to realize this project.
