const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing");
  const tx = await fundMe.withdraw();
  await tx.wait(1);
  console.log("Got it back!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
