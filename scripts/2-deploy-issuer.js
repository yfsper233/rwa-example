const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deploymentsPath = "./scripts/deployments/deployed.json";

  // 读取部署信息
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

  // 获取最新的 realEstateToken 地址
  const realEstateTokenDeployment = deployments.find(
    (d) => d.contractName === "RealEstateToken"
  );

  if (!realEstateTokenDeployment) {
    throw new Error("无法找到 realEstateTokenDeployment 的部署信息");
  }

  const realEstateTokenAddress = realEstateTokenDeployment.address;
  console.log("RealEstateToken address:", realEstateTokenAddress);
  
  // Fuji 测试网上的 Functions Router 地址
  const FUNCTIONS_ROUTER_ADDRESS = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";

  // 部署 Issuer 合约
  const Issuer = await hre.ethers.getContractFactory("Issuer");
  const issuer = await Issuer.deploy(
    realEstateTokenAddress,
    FUNCTIONS_ROUTER_ADDRESS
  );

  await issuer.waitForDeployment();

  console.log("Issuer deployed to:", issuer.target);

  const deploymentInfo = {
    contractName: "Issuer",
    address: issuer.target,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  deployments.push(deploymentInfo);
  fs.writeFileSync(
    deploymentsPath,
    JSON.stringify(deployments, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
