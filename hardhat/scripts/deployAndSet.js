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
  console.log('usdc deployed',usdc.address);
  const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
  //votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
  const votingTime = time.duration.hours(2);
  const maxVotingPower = ethers.constants.MaxUint256;
  const minVotingPower = 1;
  const InsuranceFund = ethers.utils.parseUnits("250000", 6);
  const votesNeededePercentage = 7500;//75%
  const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage,usdc.address);
  await theseus.deployed();
  console.log('theseus deployed',theseus.address);
  const Staking = await hre.ethers.getContractFactory('Staking');
  const staking = await Staking.deploy();
  await staking.deployed();
  console.log('staking deployed  ',staking.address);
  const PoolTokens = await hre.ethers.getContractFactory('PoolTokens');
  const poolTokens = await PoolTokens.deploy(staking.address);
  await poolTokens.deployed();
  console.log('poolTokens deployed  ',poolTokens.address);
  const StakerHelper = await hre.ethers.getContractFactory('StakingHelper');
  const stakerHelper = await StakerHelper.deploy(poolTokens.address);
  await stakerHelper.deployed();
  console.log('stakerHelper deployed  ',stakerHelper.address);
  const CreateAriadnes = await hre.ethers.getContractFactory('CreateAriadnes');
  const createAriadnes = await CreateAriadnes.deploy(votingTime,maxVotingPower,minVotingPower,votesNeededePercentage,staking.address,poolTokens.address);
  await createAriadnes.deployed();
  console.log('createAriadnes deployed  ',createAriadnes.address);
  const ExchangeLibrary = await ethers.getContractFactory('ExchangeLibrary');

// Deploy the library contract
const library = await ExchangeLibrary.deploy();
await library.deployed();
console.log('Library deployed at:', library.address);

// Link the library to both contracts
const Exchange = await hre.ethers.getContractFactory('Exchange', {
  libraries: {
    ExchangeLibrary: library.address,
  },
});
const LoanPool = await hre.ethers.getContractFactory('LoanPool', {
  libraries: {
    ExchangeLibrary: library.address,
  },
});

const exchange = await Exchange.deploy(usdc.address,staking.address);
await exchange.deployed();
console.log('exchange deployed  ',exchange.address);
const loanPool = await LoanPool.deploy(exchange.address);
await loanPool.deployed();
console.log('loanPool deployed  ',loanPool.address);
  const minInterestRate = 10000;
  const maxInterestRate = 100000;
  const minLoanAmount = ethers.utils.parseUnits("100", 6);
  const maxLoanAmount = ethers.utils.parseUnits("5000", 6);
  //setting up loan pool
  const minMMR = 50000;
  const maxMMR = 100000;
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
  console.log('loanPool setup done');
//   //exhcnage viewer
  const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
  const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,exchange.address,theseus.address);
  await exchangeViewer.deployed();
  await exchange.setExchangeViewer(exchangeViewer.address);
  await exchange.registerLoanPool(loanPool.address);


console.log('exchangeViewer deployed  ',exchangeViewer.address);

// // payload
const Payload = await hre.ethers.getContractFactory('Payload');
const payload = await Payload.deploy();
await payload.deployed();

console.log('payload deployed  ',payload.address);

// //amm viewer
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
// //deploying and setting vamm * 3
const VAmm = await hre.ethers.getContractFactory('VAmm');
const teslaAmm = await VAmm.deploy(ammViewer.address);
await teslaAmm.deployed();
const googleAmm = await VAmm.deploy(ammViewer.address);
await googleAmm.deployed();
const metaAmm = await VAmm.deploy(ammViewer.address);
await metaAmm.deployed();


console.log('vamm deployed  ',teslaAmm.address);
console.log('vamm deployed  ',googleAmm.address);
console.log('vamm deployed  ',metaAmm.address);
const teslaBytes = ethers.utils.formatBytes32String("TSLA");
const googleBytes = ethers.utils.formatBytes32String("GOOG");
const metaBytes = ethers.utils.formatBytes32String("META");
const teslaPriced = ethers.utils.parseUnits("300", 6);
const googlePriced = ethers.utils.parseUnits("1500", 6);
const metaPriced = ethers.utils.parseUnits("190", 6);

const uniQuoteAsset = ethers.utils.parseUnits("400", 6);
const indexPricePeriod = time.duration.hours(4);
await teslaAmm.init(teslaBytes,teslaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);
await googleAmm.init(googleBytes,googlePriced,uniQuoteAsset,indexPricePeriod,exchange.address);
await metaAmm.init(metaBytes,metaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);


console.log('all vamms initiailzed');
console.log('vamm init tesla ',teslaAmm.address);
console.log('vamm init google ',googleAmm.address);
console.log('vamm init meta ',metaAmm.address);
//adding vamm's to other contracts

    //adding amm's to exchange and staking 
const tokenIDForTesla = 1;
const tokenIdForGoogle = 2;
const tokenIdForMeta = 3;
await exchange.addAmm(teslaAmm.address);
await exchange.addAmm(googleAmm.address);
await exchange.addAmm(metaAmm.address);
console.log('amms added to exchange/staking');

//creating ariadnes
const teslaAriadneAddress =  await createAriadnes.computedAddress('tesla');
await createAriadnes.create2('tesla',teslaAmm.address,tokenIDForTesla);
const googleAriadneAddress = await createAriadnes.computedAddress('google');
await createAriadnes.create2('google',googleAmm.address,tokenIdForGoogle);
const metaAriadneAddress = await createAriadnes.computedAddress('meta');
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


// //update theseus address
await ammViewer.updateTheseusDao(theseus.address);
await staking.updateTheseus(theseus.address);
await loanPool.setTheseusDao(theseus.address);
await exchange.updateTheseus(theseus.address);

console.log('theseus updated');

await theseus.addStaking(staking.address);


await theseus.addPoolTokens(poolTokens.address);
await theseus.addExchange(exchange.address);
await usdc.transfer(theseus.address,ethers.utils.parseUnits("250000", 6));

console.log('all ready here are the addresses');



// 

//logging outy the addresses
    console.log(`const ariadneTesla ='`,teslaAriadneAddress,`'`);
    console.log(`const ariadneGoogle ='`,googleAriadneAddress,`'`);
    console.log(`const ariadneMeta ='`,metaAriadneAddress,`"`);
    console.log(`const createAriadnes = "`,createAriadnes.address,`"`);
    console.log(`const TeslaAmm = "`,teslaAmm.address,`"`);
    console.log(`const GoogleAmm = "`,googleAmm.address,`"`);
    console.log(`const MetaAmm = "`,metaAmm.address,`"`);
    console.log(`const ammViewer = "`,ammViewer.address,`"`);
    console.log(`const loanpool = "`,loanPool.address,`"`);
    console.log(`const staking = "`,staking.address,`"`);
    console.log(`const exchange = "`,exchange.address,`"`);
    console.log(`const theseus = "`,theseus.address,`"`);
    console.log(`const poolTokens = "`,poolTokens.address,`"`);
    console.log(`const stakingHelper = "`,stakerHelper.address,`"`);
    console.log(`const payload = "`,payload.address,`"`);
    console.log(`const exchangeViewer = "`,exchangeViewer.address,`"`);
    console.log(`const usdc = "`,usdc.address,`"`);
    console.log(`const library ='`, library.address,`'`);

    


}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});