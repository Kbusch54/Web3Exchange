const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
    const poolTOkensAddress ='0x3b2A0BdB07eA5210074Cf2aDf71B621EBfD2B72c';
    const StakingHelper = await hre.ethers.getContractFactory("StakingHelper");
    const stakingHelper = await StakingHelper.deploy(poolTOkensAddress);
    await stakingHelper.deployed();
    console.log('stakingHelper deployed',stakingHelper.address);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});