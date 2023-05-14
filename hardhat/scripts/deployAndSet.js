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
    const maxVotingPower = 100;
    const minVotingPower = 1;
    const InsuranceFund = ethers.utils.parseUnits("250000", 6);
    const votesNeededePercentage = 75;
    const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage);
    await theseus.deployed();
    const Staking = await hre.ethers.getContractFactory('Staking');
    const staking = await Staking.deploy();
    await staking.deployed();
    const PoolTokens = await hre.ethers.getContractFactory('PoolTokens');
    const poolTokens = await PoolTokens.deploy(staking.address);
    await poolTokens.deployed();
    const CreateAriadnes = await hre.ethers.getContractFactory('CreateAriadnes');
    const createAriadnes = await CreateAriadnes.deploy(votingTime,maxVotingPower,minVotingPower,votesNeededePercentage,staking.address,poolTokens.address);
    await createAriadnes.deployed();
    const Exchange = await hre.ethers.getContractFactory('Exchange');
    const exchange = await Exchange.deploy(usdc.address,staking.address);
    await exchange.deployed();
    const LoanPool = await hre.ethers.getContractFactory('LoanPool');
    const loanPool = await LoanPool.deploy(exchange.address);
    await loanPool.deployed();
    const minInterestRate = 1;
    const maxInterestRate = 10;
    const minLoanAmount = ethers.utils.parseUnits("100", 6);
    const maxLoanAmount = ethers.utils.parseUnits("1000", 6);
    //setting up loan pool
    const minMMR = 150;
    const maxMMR = 200;
    const holdingRequirments = 100;
    const minTradingFees = 1;
    const maxTradingFees = 10;
    const minInterestRatePeriod = 1;
    const maxInterestRatePeriod = 10;
    await loanPool.setMinAndMaxInterestRate(minInterestRate,maxInterestRate);
    await loanPool.setMinAndMaxLoanAmount(minLoanAmount,maxLoanAmount);
    await loanPool.setMinAndMaxMMR(minMMR,maxMMR);
    await loanPool.setHoldingRequirments(holdingRequirments);
    await loanPool.setMinAndMaxTradingFees(minTradingFees,maxTradingFees);
    await loanPool.setMinAndMaxInterestRatePeriod(minInterestRatePeriod,maxInterestRatePeriod);
    await staking.setExchange(exchange.address);
    await staking.setPoolToken(poolTokens.address);
    //exhcnage viewer
    const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
    const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,theseus.address,exchange.address);
    await exchangeViewer.deployed();
    await exchange.setExchangeViewer(exchangeViewer.address);
    await exchange.registerLoanPool(loanPool.address);

    //payload
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

    //deploying and setting vamm * 3
    const VAmm = await hre.ethers.getContractFactory('VAmm');
    const vamm1 = await VAmm.deploy(ammViewer.address);
    await vamm1.deployed();
    const vamm2 = await VAmm.deploy(ammViewer.address);
    await vamm2.deployed();
    const vamm3 = await VAmm.deploy(ammViewer.address);
    await vamm3.deployed();
    const tesla = ethers.utils.formatBytes32String("TSLA");
    const google = ethers.utils.formatBytes32String("GOOG");
    const meta = ethers.utils.formatBytes32String("META");
    const teslaPriced = await ammViewer.getPriceValue(tesla);
    const googlePriced = await ammViewer.getPriceValue(google);
    const metaPriced = await ammViewer.getPriceValue(meta);

    const uniQuoteAsset = ethers.utils.parseUnits("1000", 6);
    const indexPricePeriod = time.duration.hours(4);
    await vamm1.init(tesla,teslaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await vamm2.init(google,googlePriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await vamm3.init(meta,metaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);


    //adding vamm's to other contracts

    //staking
    const tokenIDForTesla = await staking.addAmmTokenToPool(vamm1.address);
    const tokenIdForGoogle = await staking.addAmmTokenToPool(vamm2.address);
    const tokenIdForMeta = await staking.addAmmTokenToPool(vamm3.address);


    //creating ariadnes
    const teslaAriadneAddress = await createAriadnes.createAriadne('tesla',tesla,tokenIDForTesla);
    const googleAriadneAddress = await createAriadnes.createAriadne('google',google,tokenIdForGoogle);
    const metaAriadneAddress = await createAriadnes.createAriadne('meta',meta,tokenIdForMeta);
    //loan pool adding amm's
    await loanPool.initializeAmm(vamm1.address,teslaAriadneAddress);
    await loanPool.initializeAmm(vamm2.address,googleAriadneAddress);
    await loanPool.initializeAmm(vamm3.address,metaAriadneAddress);
    //amm viewer add amm's
    await ammViewer.addAmm(vamm1.address,'tesla','tsla',tesla);
    await ammViewer.addAmm(vamm2.address,'google','goog',google);
    await ammViewer.addAmm(vamm3.address,'meta','meta',meta);
    //update theseus address
    await ammViewer.updateTheseus(theseus.address);
    await staking.updateTheseus(theseus.address);
    await loanPool.updateTheseus(theseus.address);
    await exchange.updateTheseus(theseus.address);

    await theseus.addStaking(staking.address);
    await theseus.addPoolTokens(poolTokens.address);


    //logging outy the addresses
    console.log('ariadne tesla',teslaAriadneAddress);
    console.log('ariadne google',googleAriadneAddress);
    console.log('ariadne meta',metaAriadneAddress);
    console.log("Tesla amm",vamm1.address);
    console.log("Google amm",vamm2.address);
    console.log("Meta amm",vamm3.address);
    console.log("amm viewer",ammViewer.address);
    console.log("loan pool",loanPool.address);
    console.log("staking",staking.address);
    console.log("exchange",exchange.address);
    console.log("theseus",theseus.address);
    console.log("pool tokens",poolTokens.address);
    console.log("usdc",usdc.address);
    console.log("payload",payload.address);
    console.log("exchange viewer",exchangeViewer.address);
    console.log("create ariadnes",createAriadnes.address);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});