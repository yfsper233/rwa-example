const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentsPath = "./scripts/deployments/deployed.json";

  // 读取部署信息
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

  // 获取最新的 Issuer 地址
  const realEstateTokenDeployment = deployments.find(
    (d) => d.contractName === "RealEstateToken"
  );

  if (!realEstateTokenDeployment) {
    throw new Error("无法找到 realEstateTokenDeployment 的部署信息");
  }

  const realEstateTokenAddress = realEstateTokenDeployment.address;
  console.log("RealEstateToken address:", realEstateTokenAddress);

  // 获取 RealEstateToken 合约实例
  const EnglishAuction = await hre.ethers.getContractFactory("EnglishAuction");
  const englishAuction = await EnglishAuction.deploy(realEstateTokenAddress);

  await englishAuction.waitForDeployment();

  console.log("rwaLending address:", englishAuction.target);
  // 记录操作信息
  const operationInfo = {
    operation: "EnglishAuction",
    issuerAddress: englishAuction.target,
    timestamp: new Date().toISOString(),
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
