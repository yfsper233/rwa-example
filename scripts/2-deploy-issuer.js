const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // 获取之前部署的 RealEstateToken 地址
    const REAL_ESTATE_TOKEN_ADDRESS = "0xC5E2fd6E8284FE0C532DA86709d4Dfbd6e201C83";
    // Fuji 测试网上的 Functions Router 地址
    const FUNCTIONS_ROUTER_ADDRESS = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";

    // 部署 Issuer 合约
    const Issuer = await hre.ethers.getContractFactory("Issuer");
    const issuer = await Issuer.deploy(REAL_ESTATE_TOKEN_ADDRESS, FUNCTIONS_ROUTER_ADDRESS);

    await issuer.waitForDeployment();

    console.log("Issuer deployed to:", issuer.target);

    const deploymentInfo = {
        contractName: "Issuer",
        address: issuer.target,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
        './scripts/deployments/deploy-issuer-result.json',
        JSON.stringify(deploymentInfo, null, 2)
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });