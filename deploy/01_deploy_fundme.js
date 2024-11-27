const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { developmentChains } = require("../helper-hardhat-config");
const { tags } = require("./00_deploy_mocks");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let chainId = network.config.chainId;

  let ethUsdPriceAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceAddress],
    log: true,
  });
  log("------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
