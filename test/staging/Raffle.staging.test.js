const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Staging Tests", function () {
      let raffle, entranceFee, deployer;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        entranceFee = await raffle.getEntranceFee();
      });

      describe("fulfillRandomWords", function () {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
          // enter the raffle
          console.log("Setting up test...");
          const startingTimeStamp = await raffle.getLastTimeStamp();
          const accounts = await ethers.getSigners();

          console.log("Setting up Listener...");
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              // event listener for WinnerPicked
              console.log("WinnerPicked event fired!");
              // assert throws an error if it fails, so we need to wrap
              // it in a try/catch so that the promise returns event
              // if it fails.
              try {
                // Now lets get the ending values...
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLastTimeStamp();
                await expect(raffle.getPlayer(0)).to.be.reverted;
                // Comparisons to check if our ending values are correct:
                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                console.log(winnerEndingBalance.toString());
                console.log(winnerStartingBalance.add(entranceFee).toString());
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(entranceFee).toString()
                );
                assert(endingTimeStamp > startingTimeStamp);
                resolve(); // if try passes, resolves the promise
              } catch (e) {
                reject(e); // if try fails, rejects the promise
              }
            });

            // kicking off the event by mocking the chain link keepers and vrf coordinator
            console.log("Entering Raffle...");
            const tx = await raffle.enterRaffle({ value: entranceFee });
            await tx.wait(1);
            console.log("Ok, time to wait...");
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
