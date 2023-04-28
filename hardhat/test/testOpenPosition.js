const { expect,chai } = require("chai");

const { ethers } = require("ethers");
const hre = require("hardhat");
const { loadFixture,mine,takeSnapshot,time } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
describe("depositAndStake", function () {
    async function deployContracts() {
        const [owner, otherAccount, oracle] = await hre.ethers.getSigners();
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

        const path = "events/json/appl";
        const indexPrice = parseUnits("370", 6);
        const quoteAsset = parseUnits("100", 2);
        const indexPricePeriod = 2; 
        
        const PoolTokens = await hre.ethers.getContractFactory("PoolTokens");
        const loanToks = await PoolTokens.deploy(owner.address);
        await loanToks.deployed();
       
        const Exchange = await hre.ethers.getContractFactory("Exchange");
        const exchange = await Exchange.deploy(usdc.address,loanToks.address);
        await loanToks.setStaking(exchange.address);
        const VAmm = await hre.ethers.getContractFactory("VAmm");
        const amm = await VAmm.deploy();
        await amm.init(oracle.address,path, indexPrice, quoteAsset, indexPricePeriod,exchange.address);



        return {usdc, owner, otherAccount, amm,loanToks,exchange};

};
    it("should deposit and openPosition loanPool should reflect new loan", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await exchange.stake(parseUnits("100", 6),amm.address);
        const availableBalanceBefore = await exchange.callStatic.poolAvailableUsdc(amm.address);
        const usdcOnLoanBefore = await exchange.callStatic.poolOutstandingLoans(amm.address);
        const totalSupplyBefore = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        const tradeBalanceAfter = await exchange.callStatic.tradeBalance(tradeIds[0]);
        const tradeCollateralAfter = await exchange.callStatic.tradeCollateral(tradeIds[0]);
        const loanAmount = collateral.mul(leverage);
        //pool usdc balances after loan
        const availableBalanceAfter = await exchange.callStatic.poolAvailableUsdc(amm.address);
        const usdcOnLoanAfter = await exchange.callStatic.poolOutstandingLoans(amm.address);
        const totalSupplyAfter = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        //test balances difference
        expect(availableBalanceAfter).to.equal(availableBalanceBefore.sub(loanAmount));
        expect(usdcOnLoanAfter).to.equal(usdcOnLoanBefore.add(loanAmount));
        expect(totalSupplyAfter).to.equal(totalSupplyBefore);
        expect(tradeBalanceAfter).to.equal(usdcOnLoanAfter);
        expect(tradeCollateralAfter).to.equal(collateral);
     
    });
    it("should deposit and openPosition loanPool should reflect new loan short", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await exchange.stake(parseUnits("100", 6),amm.address);
        const availableBalanceBefore = await exchange.callStatic.poolAvailableUsdc(amm.address);
        const usdcOnLoanBefore = await exchange.callStatic.poolOutstandingLoans(amm.address);
        const totalSupplyBefore = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =-1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        const tradeBalanceAfter = await exchange.callStatic.tradeBalance(tradeIds[0]);
        const tradeCollateralAfter = await exchange.callStatic.tradeCollateral(tradeIds[0]);
        const loanAmount = collateral.mul(leverage);
        //pool usdc balances after loan
        const availableBalanceAfter = await exchange.callStatic.poolAvailableUsdc(amm.address);
        const usdcOnLoanAfter = await exchange.callStatic.poolOutstandingLoans(amm.address);
        const totalSupplyAfter = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        //test balances difference
        expect(availableBalanceAfter).to.equal(availableBalanceBefore.sub(loanAmount));
        expect(usdcOnLoanAfter).to.equal(usdcOnLoanBefore.add(loanAmount));
        expect(totalSupplyAfter).to.equal(totalSupplyBefore);
        expect(tradeBalanceAfter).to.equal(usdcOnLoanAfter);
        expect(tradeCollateralAfter).to.equal(collateral);
    });
    it("should deposit and openPosition charge interest", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await exchange.stake(parseUnits("100", 6),amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const loanAmount = collateral.mul(leverage);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        await time.increase(7200);
        const interstOwed = await exchange.callStatic.interestOwed(tradeIds[0],amm.address);
        expect(interstOwed).to.equal(loanAmount.div(100));
    });
    it("should deposit and openPosition charge interest short", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await exchange.stake(parseUnits("100", 6),amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =-1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        const loanAmount = collateral.mul(leverage);
        await time.increase(7200);
        const interstOwed = await exchange.callStatic.interestOwed(tradeIds[0],amm.address);
        expect(interstOwed).to.equal(loanAmount.div(100));
    });

});

