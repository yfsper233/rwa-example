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

  const usdcAddress = "0x5425890298aed601595a70AB815c96711a31Bc65";
  const usdcUsdAggregatorAddress = "0x97FE42a7E96640D932bbc0e1580c73E705A8EB73";
  const usdcUsdFeedHeartbeat = 86400;

  // 获取 RealEstateToken 合约实例
  const RwaLending = await hre.ethers.getContractFactory("RwaLending");
  const rwaLending = await RwaLending.deploy(
    realEstateTokenAddress,
    usdcAddress,
    usdcUsdAggregatorAddress,
    usdcUsdFeedHeartbeat
  );

  await rwaLending.waitForDeployment();

  console.log("rwaLending address:", rwaLending.target);
  // 记录操作信息
  const operationInfo = {
    operation: "RWALending",
    issuerAddress: rwaLending.target,
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
