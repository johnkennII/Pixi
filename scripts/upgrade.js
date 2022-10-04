const { ethers, upgrades } = require("hardhat");

async function main() {
  const MarketplaceV2 = await ethers.getContractFactory("Marketplace2");
  const marketplaceV2 = await upgrades.upgradeProxy(MarketplaceV2);
  await marketplaceV2.deployed();
  console.log("Marketplace Upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
