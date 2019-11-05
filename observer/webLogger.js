//from official IOTA example, changed to use case
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
  const mode = 'restricted'
  const sideKey = 'mysecret'
  const provider = "https://nodes.devnet.iota.org"
  const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
  const outputHtml = document.querySelector("#output")

  // Initialise MAM State
  let mamState = Mam.init(provider)

  // Set channel mode
  mamState = Mam.changeMode(mamState, mode, sideKey)
  
  const getRoot = async () => {
    const root = "9TAOMHBDKDBDKCFIITYVAAMYHVYDQOTCYYLBSYMDUGBFGXZCFKRBGF9VMSJWJBFCLZJBVOEEFHYPE9HWY"
    return root
}

  // Callback used to pass data out of the fetch
  const logData = data =>
    (outputHtml.innerHTML += `Fetched and parsed ${JSON.parse(
      trytesToAscii(data)
    )}<br/>`)

  getRoot()
  .then(async root => {

    // Output asyncronously using "logData" callback function
    await Mam.fetch(root, mode, sideKey, logData)

    // Output syncronously once fetch is completed
    const result = await Mam.fetch(root, mode)
    result.messages.forEach(message => {

      //Parse message
      const messageString = trytesToAscii(message)
      const jsonObj = JSON.parse(messageString)

      //Get stored GPS data
      const time = jsonObj['message']['time']
      const latitude = jsonObj['message']['lat']
      const longitude = jsonObj['message']['lon']
      const altitude = jsonObj['message']['alt']
      const speed = jsonObj['message']['speed']

      outputHtml.innerHTML += `Fetched and parsed<br/>
      Time: ${time} Latitude: ${latitude} Longitude: ${longitude} Altitude: ${altitude} Speed: ${speed}<br/>`
    })

    outputHtml.innerHTML += `Verify with MAM Explorer:<br/><a target="_blank" href="${mamExplorerLink}${root}">${mamExplorerLink}${root}</a>`

  })

  
})()
