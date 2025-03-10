const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {

  const deploymentsPath = "./scripts/deployments/deployed.json";

  // 读取部署信息
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

  // 获取最新的 RealEstateToken 地址
  const realEstateTokenDeployment = deployments.find(
    (d) => d.contractName === "RealEstateToken"
  );

  if (!realEstateTokenDeployment) {
    throw new Error("无法找到 realEstateTokenDeployment 的部署信息");
  }

  const realEstateTokenAddress = realEstateTokenDeployment.address;
  console.log("RealEstateToken address:", realEstateTokenAddress);

  // 获取最新的 RealEstateToken 地址
  const issuerDeployment = deployments.find(
    (d) => d.contractName === "Issuer"
  );

  if (!issuer) {
    throw new Error("无法找到 Issuer 的部署信息");
  }
  
  const issuerAddress = issuerDeployment.address;
  console.log("Issuer address:", issuerAddress);

  // 获取 RealEstateToken 合约实例
  const RealEstateToken = await hre.ethers.getContractFactory("RealEstateToken");
  const realEstateToken = await RealEstateToken.attach(realEstateTokenAddress);

  console.log("Calling setIssuer function...");

  // 调用 setIssuer 函数
  const tx = await realEstateToken.setIssuer(issuerAddress);

  // 等待交易确认
  await tx.wait();

  console.log("setIssuer function called successfully");
  console.log("Transaction hash:", tx.hash);

  // 记录操作信息
  const operationInfo = {
    operation: "setIssuer",
    realEstateTokenAddress: realEstateTokenAddress,
    issuerAddress: issuerAddress,
    transactionHash: tx.hash,
    timestamp: new Date().toISOString()
  };

  // 将操作信息追加到部署文件
  deployments.push(operationInfo);
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));

  console.log("Operation info appended to deployments file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });