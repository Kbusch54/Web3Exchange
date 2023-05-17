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
// const USDC = await hre.ethers.getContractFactory("FakeUsdc");
//   const totalSupply = ethers.utils.parseUnits("500000", 6);
//   const usdcName = 'USDC';
//   const usdcSymbol = 'USDC';
//   const usdcDecimals = 6;
//   const usdc = await USDC.deploy(totalSupply,usdcName,usdcSymbol,usdcDecimals);
//   await usdc.deployed();
//   const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
//   //votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
//   const votingTime = time.duration.hours(2);
//   const maxVotingPower = ethers.constants.MaxUint256;
//   const minVotingPower = 1;
//   const InsuranceFund = ethers.utils.parseUnits("250000", 6);
//   const votesNeededePercentage = 7500;//75%
//   const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage,usdc.address);
//   await theseus.deployed();
//   console.log('theseus deployed');
//   const Staking = await hre.ethers.getContractFactory('Staking');
//   const staking = await Staking.deploy();
//   await staking.deployed();
//   console.log('staking deployed  ',staking.address);
//   const PoolTokens = await hre.ethers.getContractFactory('PoolTokens');
//   const poolTokens = await PoolTokens.deploy(staking.address);
//   await poolTokens.deployed();
//   console.log('poolTokens deployed  ',poolTokens.address);
//   const CreateAriadnes = await hre.ethers.getContractFactory('CreateAriadnes');
//   const createAriadnes = await CreateAriadnes.deploy(votingTime,maxVotingPower,minVotingPower,votesNeededePercentage,staking.address,poolTokens.address);
//   await createAriadnes.deployed();
//   console.log('createAriadnes deployed  ',createAriadnes.address);
//   const Exchange = await hre.ethers.getContractFactory('Exchange');
//   const exchange = await Exchange.deploy(usdc.address,staking.address);
//   await exchange.deployed();
//   console.log('exchange deployed  ',exchange.address);
//   const LoanPool = await hre.ethers.getContractFactory('LoanPool');
//   const loanPool = await LoanPool.deploy(exchange.address);
//   await loanPool.deployed();
//   console.log('loanPool deployed  ',loanPool.address);
//   const minInterestRate = 10000;
//   const maxInterestRate = 100000;
//   const minLoanAmount = ethers.utils.parseUnits("100", 6);
//   const maxLoanAmount = ethers.utils.parseUnits("1000", 6);
//   //setting up loan pool
//   const minMMR = 50000;
//   const maxMMR = 100000;
//   const minHoldingRequirments = 5; // 20%
//   const maxHoldingsReq = 20; // 5% 
//   const minTradingFees = 10000;
//   const maxTradingFees =100000;
//   const minInterestRatePeriod = time.duration.hours(1);
//   const maxInterestRatePeriod = time.duration.hours(8);
//   await loanPool.setMinAndMaxInterestRate(minInterestRate,maxInterestRate);
//   await loanPool.setMinAndMaxLoan(minLoanAmount,maxLoanAmount);
//   await loanPool.setMinAndMaxMMR(minMMR,maxMMR);
//   await loanPool.setMinAndMaxMinHoldingsReqPercentage(minHoldingRequirments,maxHoldingsReq);
//   await loanPool.setMinAndMaxTradingFee(minTradingFees,maxTradingFees);
//   await loanPool.setMinAndMaxInterestPeriods(minInterestRatePeriod,maxInterestRatePeriod);
//   await staking.setExchange(exchange.address);
//   await staking.setPoolToken(poolTokens.address);
//   console.log('loanPool setup done');
//   //exhcnage viewer
//   const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
//   const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,exchange.address,theseus.address);
//   await exchangeViewer.deployed();
//   await exchange.setExchangeViewer(exchangeViewer.address);
//   await exchange.registerLoanPool(loanPool.address);


// console.log('exchangeViewer deployed  ',exchangeViewer.address);

// // payload
// const Payload = await hre.ethers.getContractFactory('Payload');
// const payload = await Payload.deploy();
// await payload.deployed();

// console.log('payload deployed  ',payload.address);

// //amm viewer
// const unsignedMetadata = "manual-payload";
// const redstonePayload = await sdk.requestRedstonePayload(
//     {
//       dataServiceId: "redstone-main-demo",
//       uniqueSignersCount: 1,
//       dataFeeds: ["TSLA","META","GOOG"],
//     },
//     ["https://d33trozg86ya9x.cloudfront.net"],
//     unsignedMetadata
//   );
// const AmmViewer = await hre.ethers.getContractFactory('AmmViewer');
// const ammViewer = await AmmViewer.deploy(payload.address,`0x${redstonePayload}`);
// await ammViewer.deployed();

const theseusAddress = '0xc4b9f4e8d1ccbc5fad290840ee8f5fc96479a7d5';
const stakingAddress = '0x37f5CEC042b1E78E8a60cDF5A11867108Ae0b17c';
const exchangeAddress = '0xd98387fC0Dcdf7FF2DF0E252B0E351f608Aad48A';
const loanPoolAddress= '0x31a6314fE6a87EA0F98969765753f7e6573963CF';
const exchangeViewerAddresss='0x17e02A7CDeC532f1CdcC090b8dDBbDD40E512C4f';
const ammviewerAddress = '0x0c2BacF2DB04a25EA5DEF92aB115Ba5770Be3f6E';
const createAriadnesAddress = '0xeA0b45d79DfFf9D0eA96d549d5247700dEa7e149';
const poolTokensAddress = '0x4aA13F7D3618594BfE3171C66E8283c9d7d4eB34';
const payloadAddress='0x487A152E164675219F40Ec5113ee50BEbb5957be';
const usdcAddress = '0x3741fe87b3adb8eda54aee2ea8ffdc9af536a7e9';

const theseus = await ethers.getContractAt('TheseusDAO',theseusAddress);
const staking = await ethers.getContractAt('Staking',stakingAddress);
const exchange = await ethers.getContractAt('Exchange',exchangeAddress);
const loanPool = await ethers.getContractAt('LoanPool',loanPoolAddress);
const exchangeViewer = await ethers.getContractAt('ExchangeViewer',exchangeViewerAddresss);
const ammViewer = await ethers.getContractAt('AmmViewer',ammviewerAddress);
const createAriadnes = await ethers.getContractAt('CreateAriadnes',createAriadnesAddress);
console.log('ammViewer deployed  ',ammViewer.address);
// //deploying and setting vamm * 3
// const VAmm = await hre.ethers.getContractFactory('VAmm');
// const teslaAmm = await VAmm.deploy(ammViewer.address);
// await teslaAmm.deployed();
// const googleAmm = await VAmm.deploy(ammViewer.address);
// await googleAmm.deployed();
// const metaAmm = await VAmm.deploy(ammViewer.address);
// await metaAmm.deployed();


// console.log('vamm deployed  ',teslaAmm.address);
// console.log('vamm deployed  ',googleAmm.address);
// console.log('vamm deployed  ',metaAmm.address);
const teslaBytes = ethers.utils.formatBytes32String("TSLA");
const googleBytes = ethers.utils.formatBytes32String("GOOG");
const metaBytes = ethers.utils.formatBytes32String("META");
const teslaPriced = ethers.utils.parseUnits("300", 6);
const googlePriced = ethers.utils.parseUnits("1500", 6);
const metaPriced = ethers.utils.parseUnits("190", 6);

const uniQuoteAsset = ethers.utils.parseUnits("10000", 6);
const indexPricePeriod = time.duration.hours(4);
// await teslaAmm.init(teslaBytes,teslaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);
// await googleAmm.init(googleBytes,googlePriced,uniQuoteAsset,indexPricePeriod,exchange.address);
// await metaAmm.init(metaBytes,metaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);

const teslaAmmAddress = '0xFe8c55ae33E7980aeC84a9655706f838a6e1Cc9f';
const googleAmmAddress = '0x787B370D9e4DCc9B2E642b9f952a14844253C2d6';
const metaAmmAddress = '0x216371705423F981fc91590F06CB54b243c7569b';

console.log('all vamms initiailzed');
//adding vamm's to other contracts

    //adding amm's to exchange and staking 
const tokenIDForTesla = 1;
const tokenIdForGoogle = 2;
const tokenIdForMeta = 3;
// await exchange.addAmm(teslaAmmAddress);
// await exchange.addAmm(googleAmmAddress);
// await exchange.addAmm(metaAmmAddress);
console.log('amms added to exchange/staking');

//creating ariadnes
const teslaAriadneAddress =  await createAriadnes.computedAddress('tesla');
// await createAriadnes.create2('tesla',teslaAmmAddress,tokenIDForTesla);
const googleAriadneAddress = await createAriadnes.computedAddress('google');
// await createAriadnes.create2('google',googleAmmAddress,tokenIdForGoogle);
const metaAriadneAddress = await createAriadnes.computedAddress('meta');
// await createAriadnes.create2('meta',metaAmmAddress,tokenIdForMeta);
console.log('ariadnes created');
//loan pool adding amm's
// await loanPool.initializeVamm(teslaAmmAddress,teslaAriadneAddress);
// await loanPool.initializeVamm(googleAmmAddress,googleAriadneAddress);
// await loanPool.initializeVamm(metaAmmAddress,metaAriadneAddress);

console.log('loan pool amms initialized');
//amm viewer add amm's
// await ammViewer.addAmm(teslaAmmAddress,'tesla','tsla',teslaBytes);
// await ammViewer.addAmm(googleAmmAddress,'google','goog',googleBytes);
// await ammViewer.addAmm(metaAmmAddress,'meta','meta',metaBytes);
console.log('amm viewer amms added');
//update theseus address
// await ammViewer.updateTheseusDao(theseus.address);
// await staking.updateTheseus(theseus.address);
// await loanPool.setTheseusDao(theseus.address);
// await exchange.updateTheseus(theseus.address);

console.log('theseus updated');

// await theseus.addStaking(staking.address);
// await theseus.addPoolTokens(poolTokensAddress);
// a wait theseus.addExchange(exchange.address);

const usdc = await ethers.getContractAt('IERC20',usdcAddress);
await usdc.transfer(theseus.address,ethers.utils.parseUnits("250000", 6));

console.log('all ready here are the addresses');



//logging outy the addresses
    console.log('const ariadneTesla =',teslaAriadneAddress);
    console.log('const ariadneGoogle =',googleAriadneAddress);
    console.log('const ariadneMeta =',metaAriadneAddress);
    console.log("const createAriadnes = ",createAriadnes.address);
    console.log("const TeslaAmm = ",teslaAmmAddress);
    console.log("const GoogleAmm = ",googleAmmAddress);
    console.log("const MetaAmm = ",metaAmmAddress);
    console.log("const ammViewer = ",ammViewer.address);
    console.log("const loanpool = ",loanPool.address);
    console.log("const staking = ",staking.address);
    console.log("const exchange = ",exchange.address);
    console.log("const theseus = ",theseus.address);
    console.log("const poolTokens = ",poolTokensAddress);
    console.log("const payload = ",payloadAddress);
    console.log("const exchangeViewer = ",exchangeViewer.address);
    console.log("const usdc = ",usdcAddress);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});