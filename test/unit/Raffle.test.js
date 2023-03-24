const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers, deployments } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", async () => {
      let raffle, vrfCoordinatorV2Mock, player, entranceFee;
      beforeEach(async () => {
        /* 
        const { deployer,player } = await getNamedAccounts();
        deployer和player是配置里自定义的两个命名，这两个变量就是地址
        如果const accounts = await getNamedAccounts();
        那么accounts就是{ deployer:0xxA,player:0xxB }
        */

        const accounts = await ethers.getSigners();
        player = accounts[1]; // ethers.Signer 对象
        await deployments.fixture(["all"]);
        raffle = await ethers.getContract("Raffle", player);
        // raffle = await ethers.getContract("Raffle", player.address); 同样可以
        /* 
        raffle = await ethers.getContract("Raffle", player) 
        等同于 -----
        raffleContract = await ethers.getContract("Raffle");
        raffle = raffleContract.connect(player);
        */
        entranceFee = await raffle.getEntranceFee();
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          player
          // player.address 同理也可以
        );
      });
      describe("constructor", async function () {
        it("initializes the raffle correctly", async function () {
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();

          assert.equal(
            entranceFee.toString(),
            networkConfig[network.config.chainId].entranceFee
          );
          assert.equal(raffleState.toString(), "0");
          assert.equal(
            interval.toString(),
            networkConfig[network.config.chainId].keepersUpdateInterval
          );
        });
      });
      describe("enterRaffle", async () => {
        it("reverts when you do not pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            "Raffle__SendMoreToEnterRaffle"
          );
        });
        // it("doesn't allow entrance when raffle is calculating", async () => {
        //   await expect(raffle.enterRaffle()).to.be.revertedWith(
        //     "Raffle__NotOpen"
        //   );
        // });
        it("records player when they enter", async () => {
          await raffle.enterRaffle({ value: entranceFee });
          const playerForTest = await raffle.getPlayer(0);
          assert.equal(player.address, playerForTest);
        });
        it("emits event on enter", async () => {
          await expect(raffle.enterRaffle({ value: entranceFee })).to.emit(
            raffle,
            "RaffleEnter"
          );
        });
      });
    });
