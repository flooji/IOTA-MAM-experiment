const Mam = require('@iota/mam')
const { asciiToTrytes } = require('@iota/converter')

const fs = require('fs')

//MAM set up
const mode = 'restricted'
const sideKey = 'HELLOCANYOUHEARME'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

const seed = 'ESQGIXYTFOXVYTNEAOJVKIFUGQJOKMRLHSJBTQ9EJEACAMUQSZHXDAZOELQCZMSDCDNBRLMGWIHSHWSYK'//'9XBAZWXXJ9OUZOC9JMVMLEOBJZVHOJGTJZIEBFGMKVXBHDECWVNEYNZZQPVVCXVGDCUQVWDYVYZPLIXMW'

// Initialise MAM state
let mamState = Mam.init(provider,seed)
mamState = Mam.changeMode(mamState, mode, sideKey)

fs.writeFile(`mam_state.json`, JSON.stringify(mamState), function (err) {
    if (err) throw err
    console.log(`File mam_state.json created successfully.`)
})