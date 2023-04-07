const { ethers, network } = require('hardhat')

async function mockKeepers() {
  const raffle = await ethers.getContract('Raffle')
  const bytesData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(''))
  const { upkeepNeeded } = await raffle.checkUpkeep(bytesData)
  if (upkeepNeeded) {
    const tx = await raffle.performUpkeep(bytesData)
    const txReceipt = await tx.wait(1)
    const requestId = txReceipt.events[1].args.requestId
    console.log(`Performed upkeep with RequestId: ${requestId}`)
    console.log(network.config.chainId)
    if (network.config.chainId === 31337) {
      await mockVrf(requestId, raffle)
    } else {
      console.log('No upkeep needed!')
    }
  }
}

async function mockVrf(requestId, raffle) {
  console.log("We on a local network? Ok let's pretend...")
  const vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock')
  await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
  console.log('Responded!')
  const recentWinner = await raffle.getRecentWinner()
  console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
