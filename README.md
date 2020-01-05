# IOTA-MAM-experiment
Publish GPS-data in a restricted channel and fetch the data from the tangle

For a tutorial visit the wiki!

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

### 2. Publish the data to the IOTA tangle

Once you checked with ```cat /dev/ttyS0``` that data is available, you can use this data inside a script.

:information_source: If the blue light of the GNSS/GPS module is blinking, you have GNSS reception.
:information_source: If you receive 

### 3. Fetch the data from the IOTA tangle



## Support

Please [open an issue](https://github.com/flooji/IOTA-Raspberry-API/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/flooji/IOTA-Raspberry-API/compare/).

## Credits

Credits to the IOTA foundation whose [tutorials](https://docs.iota.org/docs/client-libraries/0.1/mam/js/create-restricted-channel) helped me to realize this project.
