import Web3 from 'web3';
import Wilderland from '../abis/Wilderland.json'

async function connectWallet() {
  if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
        let account = accounts[0]
        return account
      } catch (error) {
        console.log(error)
      }
    } else{
      window.alert('Please install MetaMask')
    }
}

async function loadBlockchainData() {
  const web3 = new Web3(window.ethereum)

  // We get the networkId from the browser
  const networkId = await window.ethereum.request({method: 'net_version'})

  // We use the Id as a key to find the network in the Wilderland json file
  const networkData = Wilderland.networks[networkId]

  if (networkData) {
    // We get the ABI using the imported json and the address with the network Id
    const wilderland = new web3.eth.Contract(Wilderland.abi, networkData.address)
    return wilderland
    }
}

export { connectWallet, loadBlockchainData};