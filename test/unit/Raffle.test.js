const { assert } = require("chai");
const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", async () => {
      let raffle, vrfCoordinatorV2Mock;
      beforeEach(async () => {
        const { deployer } = await getNamedAccounts();
        await deployments.fixture(["all"]);
        raffle = await ethers.getContract("Raffle", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
      });
      describe("constructor", async function () {
        it("initializes the raffle correctly", async function () {
          this.timeout(500);
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();
          assert.equal(raffleState.toString(), "0");
          assert.equal(
            interval.toString(),
            networkConfig[network.config.chainId].keepersUpdateInterval
          );
        });
      });
    });
