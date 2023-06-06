const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

      // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// Signer
const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
const ariadneTesla= "0xc07351A4f1126A5cC6373B8de56fB1790b017684"
const ariadneGoogle= "0xEF24E29f2F0794712A7C27e12a6245d68b65AbC0"
const ariadneMeta= "0x98dBfe5C26ac0cEb0DC918c09Ea3eEcd539bd5a7"
const createAriadnes=  "0x1F31e98b4cdF477957727462854f2CAfA57CAF69"
const TeslaAmm=  "0x74f769Cc664F8290DcfE69D15dFb0C4827Ea406e"
const GoogleAmm=  "0x11583585a6B7FBC764A46e56Ce7f1787ee0A884A"
const MetaAmm=  "0xD08816B8c9EcAa85A4B651194ac72e53058D14E9"
const ammViewer=  "0xbC01aAd4C5256888B965C5Dab56a705708a439B7"
const loanpool=  "0xdbAf4a1447A5D76c8255C6F0c098467fDa1C3Da1"
const staking=  "0x8EdC8f028eaE0ACb8276d517D54e2680d57EA697"
const exchange=  "0x1d67E35482a74661d287686F034dafd39352ccC3"
const theseus=  "0x8FdB0BacA21b8b1617B6A5b720517E0701c338a1"
const poolTokens=  "0xBFb634c8381d6621cCBB08434BE5CcB3B0F11cE0"
const stakingHelper=  "0x82a404Aa21551a78B8398667A823912F5ef46b1A"
const payload=  "0x8434eEcC2E7FD59f59343f66e9A85d55B40Eeb6e"
const exchangeViewer=  "0xa8C0f9C021ee0ec7Bf6F2782B575fc0aF416324C"
const usdc=  "0x48EBEBD2A4264274D303e5EB1581Ab31989F1653"

const usdcContract = await ethers.getContractAt('FakeUsdc',usdc,signer)
const stakingContract = await ethers.getContractAt('Staking',staking,signer)
const exchangeContract = await ethers.getContractAt('Exchange',exchange,signer)
const poolToken = await ethers.getContractAt('PoolTokens',poolTokens,signer)

// await usdcContract.approve(exchange,ethers.utils.parseUnits("10000", 6));
// console.log('approved')
// await exchangeContract.deposit(ethers.utils.parseUnits("10000", 6));
// console.log('deposited')
// await stakingContract.stake(ethers.utils.parseUnits("10000", 6),theseus);
// console.log('staked')

// console.log(stakingContract);
const tokeId = await stakingContract.ammPoolToTokenId(exchangeContract.address)
console.log('tokeId',tokeId)
const balance = await poolToken.balanceOf(signer.address,0)
console.log('balance',balance.toString())
const poolBal = await exchangeContract.poolTotalUsdcSupply(TeslaAmm);
console.log('poolBal',poolBal.toString())



}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});