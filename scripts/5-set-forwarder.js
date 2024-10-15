const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {

    const deploymentsPath = "./scripts/deployments/deployed.json"

    // 读取部署信息
    const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'));

    // 获取最新的 Issuer 地址
    const realEstateTokenDeployment = deployments.find(d => d.contractName === "RealEstateToken");

    if (!realEstateTokenDeployment) {
        throw new Error("无法找到 realEstateTokenDeployment 的部署信息");
    }

    const realEstateTokenAddress = realEstateTokenDeployment.address;
    console.log("RealEstateToken address:", realEstateTokenAddress);

    // 获取 RealEstateToken 合约实例
    const RealEstateToken = await hre.ethers.getContractFactory("RealEstateToken");
    const realEstateToken = await RealEstateToken.attach(realEstateTokenAddress);

    const forwarderAddress = "0xE1eB967CB771f8d0AE70908460E3a8FB24Bee800";
    console.log("forwarderAddress address:", forwarderAddress);


    try {
        // 调用 issue 函数
        const tx = await realEstateToken.setAutomationForwarder(forwarderAddress);

        // 等待交易确认
        await tx.wait();

        console.log("issue function called successfully");
        console.log("Transaction hash:", tx.hash);
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