import console from "console";
const hre = require("hardhat");

// Define the NFT
const name = "PixionGamesToken";
const symbol = "PGK";
const _metadataUri = "ipfs://QmQ2RFEmZaMds8bRjZCTJxo4DusvcBdLTS6XuDbhp5BZjY"; // TODO: Refine it

async function main() {
  await hre.run("verify:verify", {
    address: "0xb98be657d7b46fE5466b00113a642Aa5E9c641d3", // TODO: Paste after deployment
    // constructorArguments: [name, symbol, _metadataUri],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
