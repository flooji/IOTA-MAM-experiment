const Mam = require('@iota/mam')
const fs = require('fs')

const mode = 'restricted'
const sideKey = 'GPSTRACKERSCCHAIN'
const provider = 'https://nodes.devnet.iota.org'

const seed = 'PHEQASRURUYOJHR9KHTOESXYZTAIHIFRQSPAKNXBIIUIHRDZJQBIJVGIQYLXGVJELZZNDFYPKKR9JXEKO'
//'ZGNOMVEEGOBZYXZKDZNZQGMSCWOVADAFAGJEZIJRNRJWQIHEEONAHWXQYDVXVZNFORMXXBR9BAGNGUGUL'
//old: 'VUTHAFSCJEMBMWAVPRXMFGTJEKCIXFYKVESJIBEDWRKQVEWFDDTFYKUZNDSHMBLFPUAJINQPOPIEWTRTX'

//Initialise MAM State
let initial = Mam.init(provider,seed)

//Set channel mode
initial = Mam.changeMode(initial, mode, sideKey)
console.log('Initial state: ',initial)

//Store MAM state in case system breaks down
fs.writeFileSync('mam_state.json',JSON.stringify(initial))
