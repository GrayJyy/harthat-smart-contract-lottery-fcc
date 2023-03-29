const { ethers } = require("hardhat");

const networkConfig = {
  31337: {
    name: "localhost",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 本地环境的gas lane无所谓
    callbackGasLimit: "500000",
    keepersUpdateInterval: "30",
  },

  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", // 测试网上对应chain link的vrfCoordinatorV2接口的地址  查询地址在上面
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei Key Hash on page: https://docs.chain.link/vrf/v2/subscription/supported-networks
    subscriptionId: "768",
    callbackGasLimit: "500000",
    keepersUpdateInterval: "30",
  },
};

const developmentChains = ["localhost", "hardhat"];

module.exports = {
  networkConfig,
  developmentChains,
};
