const { ethers, upgrades, run } = require("hardhat");
const fs = require("fs");

async function deploy_presale() {
  const PreSale = await ethers.getContractFactory("PreSale");
  const presale = await upgrades.deployProxy(PreSale);

  await presale.deployed();
  console.log("PreSale Deployed to:", presale.address);
  return presale.address;
}

async function deploy_marketplace(presale_address) {
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await upgrades.deployProxy(Marketplace, [
    presale_address,
  ]);
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
  return marketplace.address;
}

async function deploy_nft_contract(marketplace_address) {
  const PGNFToken = await ethers.getContractFactory("PixionGamesToken");
  const pgnftoken = await PGNFToken.deploy(marketplace_address);
  await pgnftoken.deployed();
  console.log("NFT Token Contract deployed to:", pgnftoken.address);

  return pgnftoken.address;
}

async function main() {
  // presale_address = await deploy_presale();
  // console.log("PreSale Deployed to:", presale_address);

  // marketplace_address = await deploy_marketplace(presale_address);
  // console.log("Marketplace deployed to:", marketplace_address);

  marketplace_address = "0x992B3c9B77f181A77bBab90F8C1b51Ee61b83409";

  nftTokenAddress = await deploy_nft_contract(marketplace_address);
  console.log("NFT Contract deployed to:", nftTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
