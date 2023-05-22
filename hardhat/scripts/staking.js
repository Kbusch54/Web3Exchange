const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

      // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// Signer
const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
const staking =  "0x0C9dfCBe62a84344fE53B2B39f9dc9906bbdEFC4"
const usdc =  "0xAADbde5D0ED979b0a88770be054017fC40Bc43d1"
const exchange =  "0xbf68D4a14c353B9781e5c481413DaEa0d9bD5405"
const TeslaAmm =  "0xd4e3F66E134558Df57cD7Ce2e17758Bf9e041851"

const usdcContract = await ethers.getContractAt('FakeUsdc',usdc,signer)
const stakingContract = await ethers.getContractAt('Staking',staking,signer)
const exchangeContract = await ethers.getContractAt('Exchange',exchange,signer)

await usdcContract.approve(exchange,ethers.utils.parseUnits("10000", 6));
console.log('approved')
await exchangeContract.deposit(ethers.utils.parseUnits("10000", 6));
console.log('deposited')
await stakingContract.stake(ethers.utils.parseUnits("10000", 6),TeslaAmm);
console.log('staked')

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});