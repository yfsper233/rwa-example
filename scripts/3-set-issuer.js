const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const realEstateTokenAddress = "0xC5E2fd6E8284FE0C532DA86709d4Dfbd6e201C83";
  const issuerAddress = "0x58Ce2f55Fc38Da928Cb90A7a111a5CE944530248";

  console.log("RealEstateToken address:", realEstateTokenAddress);
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
  fs.writeFileSync("./scripts/deployments/set-issure-result.json", JSON.stringify(operationInfo, null, 2));

  console.log("Operation info appended to deployments file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });