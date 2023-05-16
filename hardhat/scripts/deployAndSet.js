const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

      // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// Signer
const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);



//deploying contracts
const USDC = await hre.ethers.getContractFactory("FakeUsdc");
const totalSupply = ethers.utils.parseUnits("500000", 6);
const usdcName = 'USDC';
const usdcSymbol = 'USDC';
const usdcDecimals = 6;
const usdc = await USDC.deploy(totalSupply,usdcName,usdcSymbol,usdcDecimals);
await usdc.deployed();
const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
//votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
const votingTime = time.duration.hours(2);
const maxVotingPower = ethers.constants.MaxUint256;//no maximum
const minVotingPower = 1;
const InsuranceFund = ethers.utils.parseUnits("250000", 6);
const votesNeededePercentage = 7500;//75%
const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage,usdc.address);
await theseus.deployed();
// console.log('theseus deployed  ',theseus.address);
const Staking = await hre.ethers.getContractFactory('Staking');
const staking = await Staking.deploy();
await staking.deployed();
// console.log('staking deployed  ',staking.address);
const PoolTokens = await hre.ethers.getContractFactory('PoolTokens');
const poolTokens = await PoolTokens.deploy(staking.address);
await poolTokens.deployed();
// console.log('poolTokens deployed  ',poolTokens.address);
const CreateAriadnes = await hre.ethers.getContractFactory('CreateAriadnes');
const createAriadnes = await CreateAriadnes.deploy(votingTime,maxVotingPower,minVotingPower,votesNeededePercentage,staking.address,poolTokens.address);
await createAriadnes.deployed();
// console.log('createAriadnes deployed  ',createAriadnes.address);
const Exchange = await hre.ethers.getContractFactory('Exchange');
const exchange = await Exchange.deploy(usdc.address,staking.address);
await exchange.deployed();
// console.log('exchange deployed  ',exchange.address);
const LoanPool = await hre.ethers.getContractFactory('LoanPool');
const loanPool = await LoanPool.deploy(exchange.address);
await loanPool.deployed();
// console.log('loanPool deployed  ',loanPool.address);
const minInterestRate = 10000;//1%
const maxInterestRate = 100000;//10%
const minLoanAmount = ethers.utils.parseUnits("100", 6);
const maxLoanAmount = ethers.utils.parseUnits("10000", 6);
//setting up loan pool
const minMMR = 50000;//5%
const maxMMR = 100000;//10%
const minHoldingRequirments = 5; // 20%
const maxHoldingsReq = 20; // 5% 
const minTradingFees = 10000;
const maxTradingFees =100000;
const minInterestRatePeriod = time.duration.hours(1);
const maxInterestRatePeriod = time.duration.hours(8);
await loanPool.setMinAndMaxInterestRate(minInterestRate,maxInterestRate);
await loanPool.setMinAndMaxLoan(minLoanAmount,maxLoanAmount);
await loanPool.setMinAndMaxMMR(minMMR,maxMMR);
await loanPool.setMinAndMaxMinHoldingsReqPercentage(minHoldingRequirments,maxHoldingsReq);
await loanPool.setMinAndMaxTradingFee(minTradingFees,maxTradingFees);
await loanPool.setMinAndMaxInterestPeriods(minInterestRatePeriod,maxInterestRatePeriod);
await staking.setExchange(exchange.address);
await staking.setPoolToken(poolTokens.address);
//exhcnage viewer
const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,exchange.address,theseus.address);
await exchangeViewer.deployed();
await exchange.setExchangeViewer(exchangeViewer.address);
await exchange.registerLoanPool(loanPool.address);

console.log('exchangeViewer deployed  ',exchangeViewer.address);

payload
const Payload = await hre.ethers.getContractFactory('Payload');
const payload = await Payload.deploy();
await payload.deployed();

//amm viewer
const unsignedMetadata = "manual-payload";
const redstonePayload = await sdk.requestRedstonePayload(
    {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","META","GOOG"],
    },
    ["https://d33trozg86ya9x.cloudfront.net"],
    unsignedMetadata
  );
const AmmViewer = await hre.ethers.getContractFactory('AmmViewer');
const ammViewer = await AmmViewer.deploy(payload.address,`0x${redstonePayload}`);
await ammViewer.deployed();

console.log('ammViewer deployed  ',ammViewer.address);
//deploying and setting vamm * 3
const VAmm = await hre.ethers.getContractFactory('VAmm');
const teslaAmm = await VAmm.deploy(ammViewer.address);
await teslaAmm.deployed();
const googleAmm = await VAmm.deploy(ammViewer.address);
await googleAmm.deployed();
const metaAmm = await VAmm.deploy(ammViewer.address);
await metaAmm.deployed();
const teslaBytes = ethers.utils.formatBytes32String("TSLA");
const googleBytes = ethers.utils.formatBytes32String("GOOG");
const metaBytes = ethers.utils.formatBytes32String("META");
const teslaPriced = parseUnits("166", 6);
const googlePriced = parseUnits("119", 6);
const metaPriced = parseUnits("238", 6);

const uniQuoteAsset = ethers.utils.parseUnits("10000", 6);
const indexPricePeriod = time.duration.hours(4);
await teslaAmm.init(teslaBytes,teslaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);
await googleAmm.init(googleBytes,googlePriced,uniQuoteAsset,indexPricePeriod,exchange.address);
await metaAmm.init(metaBytes,metaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);


console.log('all vamms initiailzed');
//adding vamm's to other contracts

//staking
const tokenIDForTesla = await staking.callStatic.addAmmTokenToPool(teslaAmm.address);
await staking.addAmmTokenToPool(teslaAmm.address);
const tokenIdForGoogle = await staking.callStatic.addAmmTokenToPool(googleAmm.address);
await staking.addAmmTokenToPool(googleAmm.address);
const tokenIdForMeta = await staking.callStatic.addAmmTokenToPool(metaAmm.address);
await staking.addAmmTokenToPool(metaAmm.address);

    console.log(tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta);
//creating ariadnes
const teslaAriadneAddress = await createAriadnes.callStatic.create2('tesla',teslaAmm.address,tokenIDForTesla);
await createAriadnes.create2('tesla',teslaAmm.address,tokenIDForTesla);
const googleAriadneAddress = await createAriadnes.callStatic.create2('google',googleAmm.address,tokenIdForGoogle);
await createAriadnes.create2('google',googleAmm.address,tokenIdForGoogle);
const metaAriadneAddress = await createAriadnes.callStatic.create2('meta',metaAmm.address,tokenIdForMeta);
await createAriadnes.create2('meta',metaAmm.address,tokenIdForMeta);

console.log('ariadnes created');
//loan pool adding amm's
await loanPool.initializeVamm(teslaAmm.address,teslaAriadneAddress);
await loanPool.initializeVamm(googleAmm.address,googleAriadneAddress);
await loanPool.initializeVamm(metaAmm.address,metaAriadneAddress);

console.log('loan pool amms initialized');
//amm viewer add amm's
await ammViewer.addAmm(teslaAmm.address,'tesla','tsla',teslaBytes);
await ammViewer.addAmm(googleAmm.address,'google','goog',googleBytes);
await ammViewer.addAmm(metaAmm.address,'meta','meta',metaBytes);
console.log('amm viewer amms added');
//update theseus address
await ammViewer.updateTheseusDao(theseus.address);
await staking.updateTheseus(theseus.address);
await loanPool.setTheseusDao(theseus.address);
await exchange.updateTheseus(theseus.address);

console.log('theseus updated');

await theseus.addStaking(staking.address);
await theseus.addPoolTokens(poolTokens.address);
await theseus.addExchange(exchange.address);


await usdc.transfer(theseus.address,parseUnits("250000", 6));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});