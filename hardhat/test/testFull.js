const { WrapperBuilder } = require("@redstone-finance/evm-connector");
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");
const { expect,chai } = require("chai");
const theseusABI = require("../artifacts/contracts/daos/TheseusDAO.sol/TheseusDAO.json");
const { ethers } = require("ethers");
const hre = require("hardhat");
const {
    loadFixture,
    mine,
    takeSnapshot,
    time,
  } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
describe("Testing Full deployment", function () {
    async function deployContracts() {
        const [owner, otherAccount,payload] =await hre.ethers.getSigners();
        const USDC = await hre.ethers.getContractFactory("FakeUsdc");
    const totalSupply = ethers.utils.parseUnits("500000", 6);
    const usdcName = 'USDC';
    const usdcSymbol = 'USDC';
    const usdcDecimals = 6;
    const usdc = await USDC.deploy(totalSupply,usdcName,usdcSymbol,usdcDecimals);
    await usdc.deployed();
    console.log('usdc deployed  ',usdc.address);
    const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
    //votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
    const votingTime = time.duration.hours(2);
    const maxVotingPower = 100000000000000;
    const minVotingPower = 10000;
    const InsuranceFund = ethers.utils.parseUnits("250000", 6);
    const votesNeededePercentage = 7500;//75%
    const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage);
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
    const minInterestRate = 10000;
    const maxInterestRate = 100000;
    const minLoanAmount = ethers.utils.parseUnits("100", 6);
    const maxLoanAmount = ethers.utils.parseUnits("1000", 6);
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
    //exhcnage viewer
    const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
    const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,exchange.address,theseus.address);
    await exchangeViewer.deployed();
    await exchange.setExchangeViewer(exchangeViewer.address);
    await exchange.registerLoanPool(loanPool.address);

    // console.log('exchangeViewer deployed  ',exchangeViewer.address);

    //payload
    // const Payload = await hre.ethers.getContractFactory('Payload');
    // const payload = await Payload.deploy();
    // await payload.deployed();

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
    const AmmViewer = await hre.ethers.getContractFactory('TestAmmViewer');
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
    const teslaPriced = parseUnits("370", 6);
    const googlePriced = parseUnits("1500", 6);
    const metaPriced = parseUnits("200", 6);

    const uniQuoteAsset = ethers.utils.parseUnits("10000", 6);
    const indexPricePeriod = time.duration.hours(4);
    await teslaAmm.init(teslaBytes,teslaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await googleAmm.init(googleBytes,googlePriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await metaAmm.init(metaBytes,metaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);


    // console.log('all vamms initiailzed');
    //adding vamm's to other contracts

    //staking
    const tokenIDForTesla = await staking.callStatic.addAmmTokenToPool(teslaAmm.address);
    await staking.addAmmTokenToPool(teslaAmm.address);
    const tokenIdForGoogle = await staking.callStatic.addAmmTokenToPool(googleAmm.address);
    await staking.addAmmTokenToPool(googleAmm.address);
    const tokenIdForMeta = await staking.callStatic.addAmmTokenToPool(metaAmm.address);
    await staking.addAmmTokenToPool(metaAmm.address);

        // console.log(tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta);
    //creating ariadnes
    const teslaAriadneAddress = await createAriadnes.callStatic.create2('tesla',teslaAmm.address,tokenIDForTesla);
    await createAriadnes.create2('tesla',teslaAmm.address,tokenIDForTesla);
    const googleAriadneAddress = await createAriadnes.callStatic.create2('google',googleAmm.address,tokenIdForGoogle);
    await createAriadnes.create2('google',googleAmm.address,tokenIdForGoogle);
    const metaAriadneAddress = await createAriadnes.callStatic.create2('meta',metaAmm.address,tokenIdForMeta);
    await createAriadnes.create2('meta',metaAmm.address,tokenIdForMeta);

    // console.log('ariadnes created');
    //loan pool adding amm's
    await loanPool.initializeVamm(teslaAmm.address,teslaAriadneAddress);
    await loanPool.initializeVamm(googleAmm.address,googleAriadneAddress);
    await loanPool.initializeVamm(metaAmm.address,metaAriadneAddress);

    console.log('loan pool amms initialized');
    //amm viewer add amm's
    await ammViewer.addAmm(teslaAmm.address,'tesla','tsla',teslaBytes);
    await ammViewer.addAmm(googleAmm.address,'google','goog',googleBytes);
    await ammViewer.addAmm(metaAmm.address,'meta','meta',metaBytes);
    // console.log('amm viewer amms added');
    //update theseus address
    await ammViewer.updateTheseusDao(theseus.address);
    await staking.updateTheseus(theseus.address);
    await loanPool.setTheseusDao(theseus.address);
    await exchange.updateTheseus(theseus.address);

    console.log('theseus updated');

    await theseus.addStaking(staking.address);
    await theseus.addPoolTokens(poolTokens.address);


    //logging outy the addresses
    // console.log('ariadne tesla',teslaAriadneAddress);
    // console.log('ariadne google',googleAriadneAddress);
    // console.log('ariadne meta',metaAriadneAddress);
    // console.log("Tesla amm",teslaAmm.address);
    // console.log("Google amm",googleAmm.address);
    // console.log("Meta amm",metaAmm.address);
    // console.log("amm viewer",ammViewer.address);
    // console.log("loan pool",loanPool.address);
    // console.log("staking",staking.address);
    // console.log("exchange",exchange.address);
    // console.log("theseus",theseus.address);
    // console.log("pool tokens",poolTokens.address);
    // console.log("usdc",usdc.address);
    // console.log("payload",payload.address);
    // console.log("exchange viewer",exchangeViewer.address);
    // console.log("create ariadnes",createAriadnes.address);
        return { 
    owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
    staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
    exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
}
    }
it.skip("should deploy the contracts", async function () {
    const { 
        owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts)
    console.log('ready to go');
});
it.skip("should deposit and stake", async function () {
    const { 
        owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    const availablebal = await exchange.callStatic.availableBalance(owner.address);
    console.log('available balance',availablebal.toString());
    await staking.stake(availablebal,teslaAmm.address);
    const poolTotalUsdc = await exchange.callStatic.poolTotalUsdcSupply(teslaAmm.address);
    console.log('pool total usdc',formatUnits(poolTotalUsdc,6));
    const poolTotalavailable = await exchange.callStatic.poolAvailableUsdc(teslaAmm.address);
    console.log('pool total available',formatUnits(poolTotalavailable,6));
    const postStakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post stake balance',formatUnits(postStakeBalance,6));
    const poolTokensBalance = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance,18));
});
it.skip("should withdraw and unstake", async function () {
    const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    const availablebal = await exchange.callStatic.availableBalance(owner.address);
    console.log('available balance',availablebal.toString());
    await staking.stake(availablebal,teslaAmm.address);
    const poolTotalUsdc = await exchange.callStatic.poolTotalUsdcSupply(teslaAmm.address);
    console.log('pool total usdc',formatUnits(poolTotalUsdc,6));
    const poolTotalavailable = await exchange.callStatic.poolAvailableUsdc(teslaAmm.address);
    console.log('pool total available',formatUnits(poolTotalavailable,6));
    const postStakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post stake balance',formatUnits(postStakeBalance,6));
    const poolTokensBalance = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance,18));
    const amountToBurn = poolTokensBalance.sub(200000);
    console.log('amount to burn',amountToBurn.toString());
    await staking.unStake(amountToBurn,teslaAmm.address);
    const postUnstakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post Unstake balance',formatUnits(postUnstakeBalance,6));
    const poolTokensBalance2 = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance2,18));

});
it('should stake and allow theseus dao vote',async function(){
    const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,staking}=await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);
    const tokenBalFromTheseus = await theseus.callStatic.isTokenHolder(owner.address);
    console.log('token bal from theseus',tokenBalFromTheseus);
    const votesNeeded = await theseus.callStatic.votesNeededPercentage();
    console.log('votes needed',votesNeeded.toString());

    const newVotesNeededPercentage = 9500; // Example value

    const transaction = await theseus.populateTransaction.updateSignaturesRequired(newVotesNeededPercentage);
    console.log('transaction',transaction);

  
    await theseus.newProposal(transaction.to,transaction.data);
    const proposal = await theseus.callStatic.proposals(0);
    console.log('proposal',proposal);
    console.log('owner address: ',owner.address);
    const hash = ethers.utils.keccak256(transaction.data);
    const trasnactionHash = await theseus.callStatic.getTransactionHash(0,transaction.to,0,transaction.data);
    const signature = await owner.signMessage(trasnactionHash);
      console.log('signature',signature);
      console.log('hash',hash);
        console.log('transaction hash',trasnactionHash);
      const verified = await theseus.callStatic.recover(trasnactionHash, signature);
        console.log('verified',verified);
    const signatures = [signature];
    // await theseus.executeTransaction(0,theseus.address,0,encodedFunctionCall.data,signatures);
    // const postProposal = await theseus.callStatic.proposals(0);
    // console.log('post proposal',postProposal);



});




});
