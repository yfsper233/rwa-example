require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const fs = require("fs");
const { task } = require("hardhat/config");

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



task("cancel-pending-request", "Cancels a pending request in the Issuer contract")
  .setAction(async (taskArgs, hre) => {
    // 使用说明：
    // 运行任务：npx hardhat cancel-pending-request --network fuji
    const deploymentsPath = "./scripts/deployments/deployed.json"
    const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));
    const issuerDeployment = deployments.find(d => d.contractName === "Issuer");

    if (!issuerDeployment) {
      throw new Error("无法找到 Issuer 的部署信息");
    }

    const issuerAddress = issuerDeployment.address;
    console.log("Issuer address:", issuerAddress);

    // 获取 Issuer 合约实例
    const Issuer = await hre.ethers.getContractFactory("Issuer");
    const issuer = await Issuer.attach(issuerAddress);

    console.log("Calling cancelPendingRequest function...");

    try {
      // 调用 cancelPendingRequest 函数
      const tx = await issuer.cancelPendingRequest();

      // 等待交易确认
      const receipt = await tx.wait();

      console.log("cancelPendingRequest function called successfully");
      console.log("Transaction hash:", tx.hash);
    } catch (error) {
      console.error("Error calling cancelPendingRequest function:", error.message);
    }
  });

