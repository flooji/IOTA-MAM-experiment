const Mam = require('@iota/mam')
const {trytesToAscii } = require('@iota/converter')

const mode = 'restricted'
const sideKey = 'mysecret'
const provider = 'https://nodes.devnet.iota.org'

const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${sideKey.padEnd(81, '9')}&root=`

// Initialise MAM State
let mamState = Mam.init(provider)

// Set channel mode
mamState = Mam.changeMode(mamState, mode, sideKey)

//set MAM channelID (same as root)
const channelID = "O9SBQTUCWBLZJPVGNZYGFLQXSBIWNWJLREOWKDRBKWAWPNNFFNJEQCYDAWSORJLPJSJIHIFQYDYLJYXVJ"//"DQEN9WBGPUDSEQQBKGMUVXITBIPQL9PCQVQEQFXIEJSTYCPXCXMLATGPBSXSEFRKJHUVGVWCIKZLZTRVD"//"IQQXVZ9QIBDVX9LKJPJYCCVSZZQEXKOZGPHOWHUSEEITHJGFJDNKIGL99ATQXTDOOXALF99FHEATKCAVH"


const fetchData = async root => {
    console.log('Fetch started...\nPlease wait a few seconds: \n')
    try {

    // Output asyncronously 
    let response = await Mam.fetch(root, mode, sideKey, function (data) {

        console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
    })

    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode)
    result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
    
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    } catch (err) {
        console.log('Error: ', err)
    }
}

fetchData(channelID)

