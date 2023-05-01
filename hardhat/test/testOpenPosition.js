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
        const Staking = await hre.ethers.getContractFactory("Staking");
        const staking = await Staking.deploy();
       
        const Exchange = await hre.ethers.getContractFactory("Exchange");
        const exchange = await Exchange.deploy(usdc.address,staking.address);
        const stakeAdd = staking.address;
        console.log("stakeAdd",stakeAdd);
        const exStakingAdd = await exchange.callStatic.staking();
        console.log("exStakingAdd",exStakingAdd);
        console.log('loanpool tokens contract address',loanToks.address);
        await loanToks.setStaking(staking.address);
        await staking.setExchange(exchange.address);
        await staking.setPoolToken(loanToks.address);
        const VAmm = await hre.ethers.getContractFactory("VAmm");
        const amm = await VAmm.deploy();
        await amm.init(oracle.address,path, indexPrice, quoteAsset, indexPricePeriod,exchange.address);



        return {usdc, owner, otherAccount, amm,loanToks,exchange,staking};

};
    async function openPosition() {
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const tradeId = await exchange.callStatic.getTradeIds(owner.address);
        return {usdc, owner, otherAccount, amm,loanToks,exchange,collateral,leverage,side,tradeId};
    };
    it.skip("should deposit and openPosition loanPool should reflect new loan", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
        const availableBalanceBefore = await exchange.callStatic.poolAvailableUsdc(amm.address);
        const usdcOnLoanBefore = await exchange.callStatic.poolOutstandingLoans(amm.address);
        const totalSupplyBefore = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        console.log("availableBalanceBefore",formatUnits(availableBalanceBefore,6));
        console.log("usdcOnLoanBefore",formatUnits(usdcOnLoanBefore,6));
        console.log("totalSupplyBefore",formatUnits(totalSupplyBefore,6));
        // const collateral = parseUnits("10", 6);
        // const leverage = 2;
        // const side =1;
        // await exchange.openPosition(amm.address,collateral,leverage,side);
        // const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        // const tradeBalanceAfter = await exchange.callStatic.tradeBalance(tradeIds[0]);
        // const tradeCollateralAfter = await exchange.callStatic.tradeCollateral(tradeIds[0]);
        // const loanAmount = collateral.mul(leverage);
        // //pool usdc balances after loan
        // const availableBalanceAfter = await exchange.callStatic.poolAvailableUsdc(amm.address);
        // const usdcOnLoanAfter = await exchange.callStatic.poolOutstandingLoans(amm.address);
        // const totalSupplyAfter = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
        // //test balances difference
        // expect(availableBalanceAfter).to.equal(availableBalanceBefore.sub(loanAmount));
        // expect(usdcOnLoanAfter).to.equal(usdcOnLoanBefore.add(loanAmount));
        // expect(totalSupplyAfter).to.equal(totalSupplyBefore);
        // expect(tradeBalanceAfter).to.equal(usdcOnLoanAfter);
        // expect(tradeCollateralAfter).to.equal(collateral);
     
    });
    it.skip("should deposit and openPosition loanPool should reflect new loan short", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
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
    it.skip("should deposit and openPosition charge interest", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const loanAmount = collateral.mul(leverage);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        const position = await exchange.callStatic.positions(tradeIds[0]);
        console.log('positioon',position);
        await time.increase(7200);
        const interstOwed = await exchange.callStatic.interestOwed(tradeIds[0],amm.address);
        expect(interstOwed).to.equal(loanAmount.div(100));
    });
    it.skip("should deposit and openPosition charge interest short", async function () {
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
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
    it.skip("should add liquidity to the position and increase collateral and loan amount", async function () {
        const {usdc, owner, otherAccount, amm, loanToks, exchange,staking} = await loadFixture(deployContracts);
        // ... set up the initial state (deposit, stake, open position)
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
        const collateral = parseUnits("10", 6);
        const leverage = 2;
        const side =1;
        await exchange.openPosition(amm.address,collateral,leverage,side);
        const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
        
        // Capture initial state values
        const initialCollateral = await exchange.tradeCollateral(tradeIds[0]);
        const position = await exchange.positions(tradeIds[0]);
        // console.log('position',position.loanedAmount);
        const initialLoanedAmount = position.loanedAmount;
        
        // Call addLiquidityToPosition
        const addedCollateral = parseUnits("5", 6);
        const leverage2 = 4;
        await exchange.addLiquidityToPosition(tradeIds[0], leverage2, addedCollateral);
        
        // Check if collateral and loaned amount are increased
        const newCollateral = await exchange.tradeCollateral(tradeIds[0]);
        const positionAfter = await exchange.positions(tradeIds[0]);
        const newLoanedAmount = positionAfter.loanedAmount;
        expect(newCollateral).to.equal(initialCollateral.add(addedCollateral));
        const expectedLoanAmount = initialLoanedAmount.add(addedCollateral.mul(leverage2));
        expect(newLoanedAmount).to.equal(expectedLoanAmount);
    });
    it.skip("should revert when trying to add liquidity with zero collateral", async function () {
        // const {usdc, owner, otherAccount, amm, loanToks, exchange} = await loadFixture(deployContracts);
        // ... set up the initial state (deposit, stake, open position)
        const {usdc, owner, otherAccount, amm,loanToks,exchange,collateral,side,tradeId} = await loadFixture(openPosition);
        // Call addLiquidityToPosition with zero collateral
        const addedCollateral = parseUnits("0", 6);
        const leverage = 2;
        expect(exchange.addLiquidityToPosition(tradeId, leverage, addedCollateral)).to.be.reverted;
    });

    // Test case 3: Verify that adding liquidity with insufficient available balance reverts the transaction
    it.skip("should revert when trying to add liquidity with insufficient available balance", async function () {
        // const {usdc, owner, otherAccount, amm, loanToks, exchange} = await loadFixture(deployContracts);
        // ... set up the initial state (deposit, stake, open position)
        const {usdc, owner, otherAccount, amm,loanToks,exchange,collateral,side,tradeId} = await loadFixture(openPosition);
        // Reduce available balance to an insufficient amount
        const addedCollateral = parseUnits("10000", 6);
        const leverage = 4;
         expect( exchange.addLiquidityToPosition(tradeId, leverage, addedCollateral)).to.be.reverted;

    });
    it("should remove liquidity from a long position successfully", async function () {
        // Setup: deposit, initialize, open a position
        // ... your existing setup code here
        const {usdc, owner, otherAccount, amm,loanToks,exchange,collateral,side,tradeId} = await loadFixture(openPosition);
        // Remove liquidity from the position
        console.log('tradeId',tradeId);
        const initialPositionSize = await exchange.callStatic.positions(tradeId[0]);
        console.log('initialPositionSize',initialPositionSize.positionSize);
        console.log('owner address',owner.address);
        const removedPositionSize = initialPositionSize.positionSize.div(2);
        await exchange.removeLiquidityFromPosition(tradeId[0], removedPositionSize);
    
        // Verify that the position size has been updated
        const newPositionSize = await exchange.callStatic.positions(tradeId[0]);
        expect(newPositionSize.positionSize).to.equal(initialPositionSize.positionSize.sub(removedPositionSize));

    
        // Verify that the loaned amount and trade balance have been updated
        // const newLoanedAmount = await exchange.callStatic.tradeBalance(tradeId[0]);
        // expect(newLoanedAmount).to.equal(initialPositionSize.loanedAmount.sub(removedPositionSize));
        // const newTradeBalance = await exchange.callStatic.tradeBalance(tradeId[0]);
        // expect(newTradeBalance).to.equal(initialPositionSize.loanedAmount.sub(removedPositionSize));
    });
    it("should remove liquidity from a short position successfully", async function () {
        // Setup: deposit, initialize, open a position
        const {usdc, owner, otherAccount, amm,loanToks,exchange,staking} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("1000", 6));
        await exchange.initializeVamm(amm.address);
        await exchange.deposit(parseUnits("1000", 6));
        await staking.stake(parseUnits("100", 6),amm.address);
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
        const initialPositionSize = await exchange.callStatic.positions(tradeIds[0]);
        console.log('initialPositionSize',initialPositionSize.positionSize);
        console.log('owner address',owner.address);
        const removedPositionSize = initialPositionSize.positionSize.div(2);
        await exchange.removeLiquidityFromPosition(tradeIds[0], removedPositionSize);
    
        // Verify that the position size has been updated
        const newPositionSize = await exchange.callStatic.positions(tradeIds[0]);
        expect(newPositionSize.positionSize).to.equal(initialPositionSize.positionSize.sub(removedPositionSize));

    
        // Verify that the loaned amount and trade balance have been updated
        // const newLoanedAmount = await exchange.callStatic.tradeBalance(tradeId[0]);
        // expect(newLoanedAmount).to.equal(initialPositionSize.loanedAmount.sub(removedPositionSize));
        // const newTradeBalance = await exchange.callStatic.tradeBalance(tradeId[0]);
        // expect(newTradeBalance).to.equal(initialPositionSize.loanedAmount.sub(removedPositionSize));
    });

   

});

