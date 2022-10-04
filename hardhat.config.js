require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: [process.env.SNOWTRACE_APIKEY],
    },
  },
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: 43114,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY_FUJI], // accounts: { mnemonic: MNEMONIC },
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [process.env.PRIVATE_KEY_MAINNET], // accounts: { mnemonic: MNEMONIC },
    },
  },
};
