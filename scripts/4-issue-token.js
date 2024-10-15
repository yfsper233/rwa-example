const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
 
  const deploymentsPath = "./scripts/deployments/deployed.json"

  // 读取部署信息
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));

  // 获取最新的 Issuer 地址
  const issuerDeployment = deployments.find(d => d.contractName === "Issuer");

  if (!issuerDeployment) {
    throw new Error("无法找到 Issuer 的部署信息");
  }

  const issuerAddress = issuerDeployment.address;
  console.log("Issuer address:", issuerAddress);
 

  // 获取 Issuer 合约实例
  const Issuer = await hre.ethers.getContractFactory("Issuer");
  const issuer = await Issuer.attach(issuerAddress);

  // 设置参数
  const aliceAddress = "0xDBa1BCcdCDAB79bd4e5F69eD823c803448b5bE4f"; // 替换为 Alice 的实际地址
  const amount = 20;
  const subscriptionId = 13548; // 替换为你的 Chainlink Functions 订阅 ID
  const gasLimit = 300000;
  const donID = "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000";

  console.log("Calling issue function...");

  try {
    // 调用 issue 函数
    const tx = await issuer.issue(aliceAddress, amount, subscriptionId, gasLimit, donID);

    // 等待交易确认
    const receipt = await tx.wait();

    console.log("issue function called successfully");
    console.log("Transaction hash:", tx.hash);

    // 记录操作信息
    const operationInfo = {
      operation: "issue",
      issuerAddress: issuerAddress,
      to: aliceAddress,
      amount: amount,
      subscriptionId: subscriptionId,
      gasLimit: gasLimit,
      donID: donID,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      timestamp: new Date().toISOString()
    };
    // 将操作信息追加到部署文件
    deployments.push(operationInfo);
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));

    console.log("Operation info appended to deployments file");
  } catch (error) {
    console.error("Error calling issue function:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });