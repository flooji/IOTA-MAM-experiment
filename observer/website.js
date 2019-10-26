const TRYTE_ALPHABET = "9ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const asciiToTrytes = input => {
  let trytes = ""
  for (let i = 0; i < input.length; i++) {
    var dec = input[i].charCodeAt(0)
    trytes += TRYTE_ALPHABET[dec % 27]
    trytes += TRYTE_ALPHABET[(dec - (dec % 27)) / 27]
  }
  return trytes;
};
const trytesToAscii = trytes => {
  let ascii = ""
    for (let i = 0; i < trytes.length; i += 2) {
    ascii += String.fromCharCode(
      TRYTE_ALPHABET.indexOf(trytes[i]) +
        TRYTE_ALPHABET.indexOf(trytes[i + 1]) * 27
    )
  }
  return ascii
}


(async function() {
  const mode = "restricted"
  const sideKey = "mysecret"
  const provider = "https://nodes.devnet.iota.org"
  const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
  const outputHtml = document.querySelector("#output")

  // Initialise MAM State
  let mamState = Mam.init(provider)
  
  //get the root 
  const root = "IQQXVZ9QIBDVX9LKJPJYCCVSZZQEXKOZGPHOWHUSEEITHJGFJDNKIGL99ATQXTDOOXALF99FHEATKCAVH"

  // Callback used to pass data out of the fetch
  const logData = data =>
    (outputHtml.innerHTML += `Fetched and parsed ${JSON.parse(
      trytesToAscii(data)
    )}<br/>`)

  // Output asyncronously using "logData" callback function
  await Mam.fetch(root, mode, sideKey, logData)
  // Output syncronously once fetch is completed
  const result = await Mam.fetch(root, mode)
  await result.messages.forEach(message => {
    outputHtml.innerHTML += `Fetched and parsed ${JSON.parse(
      trytesToAscii(message)
    )}<br/>`;
  })

  outputHtml.innerHTML += `Verify with MAM Explorer:<br/><a target="_blank" href="${mamExplorerLink}${root}">${mamExplorerLink}${root}</a>`
})()
