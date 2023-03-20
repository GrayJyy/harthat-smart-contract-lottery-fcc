require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL; // https://dashboard.alchemy.com/
const PRIVATE_KEY = process.env.PRIVATE_KEY; // 注意是账户的私钥 不是公钥 需要在钱包上点击查看私钥
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY; // https://etherscan.io/
// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY  // https://coinmarketcap.com/api/
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { chainId: 31337, blockConfirmations: 1 },
    sepolia: {
      chainId: 11155111,
      blockConfirmations: 1,
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: { timeout: 30000 },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },
};
