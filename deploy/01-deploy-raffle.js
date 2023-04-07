const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const a = await getNamedAccounts()
  const accounts = await ethers.getSigners()

  const chainId = network.config.chainId
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
  if (developmentChains.includes(network.name)) {
    log("--------------------------------------accounts")
    log(accounts)
    log("--------------------------------------deployer")
    log(a)
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait(1)

    subscriptionId = transactionReceipt.events[0].args.subId

    // log(subscriptionId);
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    )
    // log(transactionReceipt.events[0].args); // todo know
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    subscriptionId = networkConfig[chainId]["subscriptionId"]
  }
  const entranceFee = networkConfig[chainId]["entranceFee"]
  const gasLane = networkConfig[chainId]["gasLane"]
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
  const interval = networkConfig[chainId]["keepersUpdateInterval"]
  log(subscriptionId)
  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ]
  console.log(args) // help to solve the big number error
  const raffle = await deploy("Raffle", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  vrfCoordinatorV2Mock &&
    (await vrfCoordinatorV2Mock.addConsumer(
      subscriptionId.toNumber(),
      raffle.address
    ))
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying.......")
    verify(raffle.address, args)
    log("------------------------------------------------")
  }
}
module.exports.tags = ["all", "raffle"]
