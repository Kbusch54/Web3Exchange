const { expect,chai } = require("chai");

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
describe("amm FFR", function () {
    async function deployContracts() {
        const [owner, otherAccount, third, theseusDao] =
          await hre.ethers.getSigners();
        const FakeCurrency = await hre.ethers.getContractFactory("FakeUsdc");
        const name = "Fake USDC";
        const decimals = 6;
        const symbol = "USDC";
        const usdc = await FakeCurrency.deploy(
          100000000000,
          name,
          symbol,
          decimals
        );
        const FakeOracle = await hre.ethers.getContractFactory("FakeOracle");
        const indexPrice = parseUnits("370", 6);
        const oracle = await FakeOracle.deploy(indexPrice);
    
        const path = "events/json/appl";
        const quoteAsset = parseUnits("100", 2);
        const indexPricePeriod =  time.duration.hours(2);
        console.log("indexPricePeriod", indexPricePeriod);
    
        const PoolTokens = await hre.ethers.getContractFactory("PoolTokens");
        const loanToks = await PoolTokens.deploy(owner.address);
        await loanToks.deployed();
        const Staking = await hre.ethers.getContractFactory("Staking");
        const staking = await Staking.deploy(theseusDao.address);
    
        const Exchange = await hre.ethers.getContractFactory("Exchange");
        const exchange = await Exchange.deploy(
          usdc.address,
          staking.address,
          theseusDao.address
        );
        const stakeAdd = staking.address;
        console.log("stakeAdd", stakeAdd);
        const exStakingAdd = await exchange.callStatic.staking();
        console.log("exStakingAdd", exStakingAdd);
        console.log("loanpool tokens contract address", loanToks.address);
        console.log('exhcnage address', exchange.address);
        
        await loanToks.setStaking(staking.address);
        await staking.setExchange(exchange.address);
        await staking.setPoolToken(loanToks.address);
        const VAmm = await hre.ethers.getContractFactory("VAmm");
        const amm = await VAmm.deploy(oracle.address);
        await amm.init(
          path,
          indexPrice,
          quoteAsset,
          indexPricePeriod,
          exchange.address
        );
        const LoanPool = await hre.ethers.getContractFactory("LoanPool");
        const loanPool = await LoanPool.deploy(exchange.address);
        const theseusDaoID = await staking.callStatic.ammPoolToTokenId(theseusDao.address);
        console.log('theseusDaoID', theseusDaoID);
        console.log('ex add loanPool', await loanPool.callStatic.exchange());
        await exchange.addAmm(amm.address);
        await exchange.registerLoanPool(loanPool.address);
        await loanPool.initializeVamm(amm.address);
        const PoolTokenAMmID = await staking.callStatic.ammPoolToTokenId(amm.address);


        console.log('PoolTokenAMmID', PoolTokenAMmID);

      

        const ExchangeViewer = await hre.ethers.getContractFactory("ExchangeViewer");
        const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address, theseusDao.address, exchange.address, amm.address);
        await exchange.setExchangeViewer(exchangeViewer.address);
        console.log("Ready to go here");
    
        return {
          usdc,
          owner,
          otherAccount,
          amm,
          oracle,
          loanToks,
          exchange,
          staking,
          loanPool,
          theseusDao,
        };
      }
      it("should mark ffr upon openPos", async function () {
        const {usdc,
            owner,
            otherAccount,
            amm,
            oracle,
            loanToks,
            exchange,
            staking,
            loanPool,
            theseusDao,}=await loadFixture(deployContracts);
            await usdc.approve(exchange.address, parseUnits("1000", 6));
            await exchange.deposit(parseUnits("1000", 6));
            const leverage = 3;
            const side=1;
            const collateral = parseUnits("100", 6);
            await staking.stake(parseUnits("800", 6),amm.address);
            await exchange.openPosition(amm.address, collateral, leverage, side); 
            const ffr = await amm.callStatic.getLiquidityChangedSnapshots();
            console.log('ffr', ffr);
            const tradeIds = await exchange.callStatic.getTradeIds(owner.address)
            const addedCollateral = parseUnits("5", 6);
            const leverage2 = 4;
            await time.increase(time.duration.hours(2));
            await oracle.setPrice(parseUnits("400", 6));
            const newPrice = await oracle.callStatic.price();
               console.log('newPrice', newPrice);
            await exchange.addLiquidityToPosition(
              tradeIds[0],
              leverage2,
              addedCollateral
            );
            const ffr2 = await amm.callStatic.getLiquidityChangedSnapshots();
            console.log('ffr2', ffr2);
            // await oracle.setPrice(parseUnits("370", 6));
            await exchange.closeOutPosition(tradeIds[0]);

            const ffr3 = await amm.callStatic.getLiquidityChangedSnapshots();
            console.log('ffr3', ffr3);
            const isFrozen = await amm.callStatic.isFrozen();
            console.log('isFrozen', isFrozen);
            //open position
            await exchange.openPosition(amm.address, collateral, leverage, side);
            const ffr4 = await amm.callStatic.getLiquidityChangedSnapshots();
            console.log('ffr4', ffr4);
            const isFrozenLast = await amm.callStatic.isFrozen();
            console.log('isFrozenLast', isFrozenLast);
      });
});