const fs = require('fs')
const { ethers, network } = require('hardhat')
const ADDRESSES_FILE = '../next-web3/constants/contractAddresses.json'
const ABI_FILE = '../next-web3/constants/abi.json'

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Update')
    await updateAddresses()
    await updateAbi()
  }
}

const updateAbi = async () => {
  const raffle = await ethers.getContract('Raffle')
  const abi = raffle.interface.format(ethers.utils.FormatTypes.json)
  fs.writeFileSync(ABI_FILE, abi)
}
const updateAddresses = async () => {
  const raffle = await ethers.getContract('Raffle')
  const currentAddress = JSON.parse(fs.readFileSync(ADDRESSES_FILE, 'utf8'))
  const chainId = network.config.chainId.toString()
  if (chainId in currentAddress) {
    if (!currentAddress[chainId].includes(raffle.address)) {
      currentAddress[chainId].push(raffle.address)
    }
  } else {
    currentAddress[chainId] = [raffle.address]
  }
  //   console.log(currentAddress)
  fs.writeFileSync(ADDRESSES_FILE, JSON.stringify(currentAddress))
}
module.exports.tags = ['all', 'update']
