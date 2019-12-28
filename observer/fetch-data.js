/*
 * @Author: florence.pfammatter 
 * @Date: 2019-11-01 11:46:26 
 * @Last Modified by: florence.pfammatter
 * @Last Modified time: 2019-11-05 20:14:01
 * @Description: Verify if a provided claim is valid by comparing it to the hashed claim on the IOTA tangle
 */

//Require Mam package from iota.js
const Mam = require('@iota/mam')
const { trytesToAscii } = require('@iota/converter')

//MAM setup 
const mode = 'restricted'
const sideKey = 'HELLOCANYOUHEARME'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${sideKey.padEnd(81, '9')}&root=`

// Initialise MAM State object
let mamState = Mam.init(provider)

//Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey)

//Make sure to use the correct root/channelID for the fetch
const channelID = "YBGAAW9PMGUIFONOBOFQPGAZFOT9YLEXPJNTZWJQFIQYKXMASYSZCSVCKBZKLPJEIFGODUWYBPWLLTIVV"

let fetchData = async (root) => {

console.log('Fetch data from the tangle. Please be patient...')

//Fetch data from tangle
await Mam.fetch(root, mode).then(data => {
    
    data.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)

}).catch(err => {
    console.log(err)
})
}

fetchData(channelID)