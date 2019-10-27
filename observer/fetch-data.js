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

const getRoot = async () => {
    const root = "O9SBQTUCWBLZJPVGNZYGFLQXSBIWNWJLREOWKDRBKWAWPNNFFNJEQCYDAWSORJLPJSJIHIFQYDYLJYXVJ"//"DQEN9WBGPUDSEQQBKGMUVXITBIPQL9PCQVQEQFXIEJSTYCPXCXMLATGPBSXSEFRKJHUVGVWCIKZLZTRVD"//"IQQXVZ9QIBDVX9LKJPJYCCVSZZQEXKOZGPHOWHUSEEITHJGFJDNKIGL99ATQXTDOOXALF99FHEATKCAVH"
    return root
}

// Callback used to pass data out of the fetch
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')

getRoot()
  .then(async root => {

    console.log('Fetch started...\nPlease wait a few seconds: \n')
    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, sideKey, logData)

    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode)
    result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))

    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
  })

