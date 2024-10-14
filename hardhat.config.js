require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "paris"
    }
  },
  networks: {
    fuji: {
      url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY], 
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};