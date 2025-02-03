const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe;
      let MockV3Aggregator;
      let deployer;
      const sendedEth = ethers.utils.parseEther("0.1");
      const DECIMALS = "8";
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
          const response = await fundMe.getPriceFeed();
          console.log("Eth price", response);
          assert.equal(response, MockV3Aggregator.address);
        });

        it("Prints the current mock price", async () => {
          const priceData = await MockV3Aggregator.latestRoundData();
          const price = ethers.utils.formatUnits(priceData.answer, DECIMALS);
          console.log("Current Price (USD/ETH):", price);
          assert.equal(price, "2000.0"); // Assuming the price is still 2000 USD/ETH
        });
      });

      describe("fund", function () {
        it("Fails if do not send enough ETH,", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("Updates the amount funded data structure", async () => {
          await fundMe.fund({ value: sendedEth });
          const response = await fundMe.addressToAmountFunded(deployer);
          assert.equal(response.toString(), sendedEth.toString());
        });
        it("Adds funder to array of funders", async () => {
          await fundMe.fund({ value: sendedEth });
          const funder = await fundMe.funders(0);
          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", function () {
        beforeEach(async () => {
          await fundMe.fund({ value: sendedEth });
        });
        it("withdraws ETH from a single funder", async () => {
          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it("is allows us to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();

          for (let i = 1; i < 5; i++) {
            const connectedFunders = await fundMe.connect(accounts[i]);
            await connectedFunders.fund({ value: sendedEth });
          }

          const startingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);

          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await ethers.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance, 0);
          await expect(fundMe.funders(0)).to.be.reverted;
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );

          for (let i = 0; i < 5; i++) {
            assert.equal(
              await fundMe.addressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("Only allows the owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const connectAttackerToContract = await fundMe.connect(attacker);
          await expect(connectAttackerToContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });
    });
