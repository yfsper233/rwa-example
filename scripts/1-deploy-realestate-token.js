const hre = require("hardhat");
const fs = require('fs');


async function main() {
    const RealEstateToken = await hre.ethers.getContractFactory("RealEstateToken");

    // 构造函数参数
    const uri = "";
    const ccipRouterAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";
    const linkTokenAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
    const currentChainSelector = "14767482510784806043";
    const functionsRouterAddress = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";

    console.log("Deploying RealEstateToken...");
    const realEstateToken = await RealEstateToken.deploy(
        uri,
        ccipRouterAddress,
        linkTokenAddress,
        currentChainSelector,
        functionsRouterAddress
    );

    await realEstateToken.waitForDeployment()

    console.log("RealEstateToken deployed to:", realEstateToken.target);

    const deployments = [];
    const deploymentInfo = {
        contractName: "RealEstateToken",
        address: realEstateToken.target,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };
    deployments.push(deploymentInfo);
    const deploymentsPath = "./scripts/deployments/deployed.json";

    fs.writeFileSync(
        deploymentsPath,
        JSON.stringify(deployments, null, 2)
    );

    console.log("Deployment info saved to deployment-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



