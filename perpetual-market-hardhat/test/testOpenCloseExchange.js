const { expect,chai } = require("chai");

const { ethers } = require("ethers");
const hre = require("hardhat");
const { loadFixture,mine,takeSnapshot } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
const { latestBlock,setNextBlockTimestamp } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");

describe("Exchange vaultsMain together ", async () => {
    async function deployContracts() {
      const [owner, otherAccount, thirdAccount,oracle] = await hre.ethers.getSigners();
      const FakeCurrency = await hre.ethers.getContractFactory("FakeErc20");
      const name = "Fake USDC";
      const decimals = 6;
      const symbol = "USDC";
      const usdc = await FakeCurrency.deploy(
        100000000000,
        name,
        symbol,
        decimals
      );
      const LoanPool = await hre.ethers.getContractFactory("LoanPool");
      const usdcAdd = usdc.address;
      const loanPool = await LoanPool.deploy('ammPool token','pTok', usdcAdd);
      const VaultMain = await hre.ethers.getContractFactory("VaultMain");
      const VAMM = await hre.ethers.getContractFactory("VAmm");
      const vamm = await VAMM.deploy();
      const LoanArray = [loanPool.address];
      const vault = await VaultMain.deploy(usdc.address,LoanArray,thirdAccount.address);
      const path = "events/json/appl";
      const VammArray = [vamm.address];
      const Exchange = await hre.ethers.getContractFactory("Exchange");
      const exchange = await Exchange.deploy(VammArray,vault.address);
      await exchange.registerPool(vamm.address,loanPool.address);
      vault.updateExchange(exchange.address);
      // const assetAddress = "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3";
      const indexPrice = parseUnits("370", 6);
      const quoteAsset = parseUnits("100", 2);
      const indexPricePeriod = 2; 
      await vamm.init(oracle.address,path, indexPrice, quoteAsset, indexPricePeriod,exchange.address);
      await loanPool.updateVault(vault.address);
      await usdc.transfer(thirdAccount.address, parseUnits("1000", 6));
      await usdc.mintAndTransfer( parseUnits("10000", 6),otherAccount.address);
      await usdc.mintAndTransfer( parseUnits("10000", 6),thirdAccount.address);
      await usdc.approve(loanPool.address, parseUnits("1000", 6));
      await usdc.connect(otherAccount).approve(loanPool.address, parseUnits("900", 6));
      await usdc.connect(thirdAccount).approve(loanPool.address, parseUnits("520", 6));
      await loanPool.connect(otherAccount).stake(parseUnits("800", 6));
      await loanPool.receiveUSDC(parseUnits("2", 3));
      mine(5)
      await loanPool.connect(thirdAccount).stake(parseUnits("500", 6));
      await loanPool.stake(parseUnits("700", 6));
      mine(2)
      return{usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle};
    }
    async function openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc) {

   

      await usdc.approve(vault.address, approveAmt);

   
      
        await vault.deposit(deposit);

        //open position
        const block = await latestBlock();
        await exchange.openPosition(user.address, vamm.address,collateral,leverage,side);
         //tradeId
         const types = ["address","uint256","int256","address","address"];
         const values = [vamm.address,block+1,side,user.address,loanPool.address];
         const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);
         return{tradeId};
    };
      it("Should open position and borrow", async () => {
          const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
          console.log("vault balance",formatUnits(await vault.availableBalance(owner.address),6))  
          //approve and deposit 100 usdc
          await usdc.approve(vault.address, parseUnits("1000", 6));
          const amount = parseUnits("100", 6);
            await vault.deposit(amount);

            console.log('loan pool usdc balance',formatUnits(await usdc.balanceOf(loanPool.address),6));
            const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
            const vammSnapshotBefore = await vamm.getLastSnapshot();
            const collateral = parseUnits("75", 6);
            //open position
            await exchange.openPosition(owner.address, vamm.address,collateral,5,1);
            const exhchangePosition = await exchange.positions(0);
            console.log('loan pool usdc balance',formatUnits(await usdc.balanceOf(loanPool.address),6));
            const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
            const vammSnapshotAfter = await vamm.getLastSnapshot();
            //tradeId
            const types = ["address","uint256","int256","address","address"];
            const values = [vamm.address,29,1,owner.address,loanPool.address];
            const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);

            //usdc balance of loan pool reflect loaned amount
          expect(loanPoolUsdcBalBefore).to.equal(loanPoolUsdcBalAfter.add(exhchangePosition.loanedAmount));
          //vamm total position size reflect position size
          expect(vammSnapshotBefore.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
          //vamm cumulative notional reflect loaned amount
          expect(vammSnapshotBefore.cumulativeNotional).to.equal(vammSnapshotAfter.cumulativeNotional.sub(exhchangePosition.loanedAmount));
          // open value Should match position size * price
          expect(exhchangePosition.openValue).to.equal(exhchangePosition.positionSize.mul(await vamm.getAssetPrice()).div(1e8));

          console.log('collateral calc',await vault.callStatic.calculateCollateral(tradeId));
      });
      it("Should close position and repay", async () => {
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //approve and deposit 100 usdc
        await usdc.approve(vault.address, parseUnits("10000", 6));
        const amount = parseUnits("5000", 6);
          await vault.deposit(amount);
          const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
          const vammSnapshotBefore = await vamm.getLastSnapshot();
          const collateral = parseUnits("75", 6);
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //open position
          await exchange.openPosition(owner.address, vamm.address,collateral,5,1);
          const exhchangePosition = await exchange.positions(0);

          const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
          const vammSnapshotAfter = await vamm.getLastSnapshot();
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //tradeId
          const types = ["address","uint256","int256","address","address"];
          const values = [vamm.address,29,1,owner.address,loanPool.address];
          const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);
        //close position
        const {avgExitPrice,usdcAmt} = await exchange.callStatic.closeOutPosition(tradeId);
        await exchange.closeOutPosition(tradeId);
        console.log('return amount',formatUnits(usdcAmt,6));
        const exhchangePositionAfter = await exchange.positions(0);
        const vammSnapshotAfterClose = await vamm.getLastSnapshot(); 
        const loanPoolUsdcBalAfterClose = await usdc.balanceOf(loanPool.address);
        const interest = await loanPool.callStatic.getInterestOwedForAmount(tradeId,exhchangePosition.loanedAmount);
        console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
        const balanceReward = await vault.callStatic.readBalanceRewards(loanPool.address,2  );
        //usdc balance of loan pool reflect loaned amount
        expect(loanPoolUsdcBalAfter).to.equal(loanPoolUsdcBalAfterClose.sub(exhchangePosition.loanedAmount.add(interest).sub(balanceReward)));
        // //vamm total position size reflect position size
          expect(vammSnapshotAfterClose.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
        //   //vamm cumulative notional reflect loaned amount
        //   //collateral Should be 0
          expect(exhchangePositionAfter.margin).to.equal(0);
        //   //loaned amount Should be 0
          expect(exhchangePositionAfter.loanedAmount).to.equal(0);
        //   //position size Should be 0
          expect(exhchangePositionAfter.positionSize).to.equal(0);
      });
      it('Should open and borrow with short', async () => {
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //approve and deposit 100 usdc
        await usdc.approve(vault.address, parseUnits("1000", 6));
        const amount = parseUnits("500", 6);
          await vault.deposit(amount);
          const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
          const vammSnapshotBefore = await vamm.getLastSnapshot();
          const collateral = parseUnits("75", 6);
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //open position
          await exchange.openPosition(owner.address, vamm.address,collateral,5,-1);
          const exhchangePosition = await exchange.positions(0);

          const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
          const vammSnapshotAfter = await vamm.getLastSnapshot();
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //tradeId
          const types = ["address","uint256","int256","address","address"];
          const values = [vamm.address,29,1,owner.address,loanPool.address];
          const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);

          console.log('hello world from test', exhchangePosition.positionSize);
          //usdc balance of loan pool reflect loaned amount
        expect(loanPoolUsdcBalBefore).to.equal(loanPoolUsdcBalAfter.add(exhchangePosition.loanedAmount));
        //vamm total position size reflect position size
        expect(vammSnapshotBefore.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
        // //vamm cumulative notional reflect loaned amount
        expect(vammSnapshotBefore.cumulativeNotional).to.equal(vammSnapshotAfter.cumulativeNotional.add(exhchangePosition.loanedAmount));
        // // open value Should match position size * price
        expect(exhchangePosition.openValue).to.equal(exhchangePosition.positionSize.mul(await vamm.getAssetPrice()).div(1e8).mul(-1));
      });
      it('Should close and repay with short', async () => {
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //approve and deposit 100 usdc
        await usdc.approve(vault.address, parseUnits("10000", 6));
        const amount = parseUnits("500", 6);
          await vault.deposit(amount);
          const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
          const vammSnapshotBefore = await vamm.getLastSnapshot();
          const collateral = parseUnits("75", 6);
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //open position
          await exchange.openPosition(owner.address, vamm.address,collateral,5,-1);
          const exhchangePosition = await exchange.positions(0);

          const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
          const vammSnapshotAfter = await vamm.getLastSnapshot();
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //tradeId
          const types = ["address","uint256","int256","address","address"];
          const values = [vamm.address,29,-1,owner.address,loanPool.address];
          const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);
        //close position

        const {avgExitPrice,usdcAmt} = await exchange.callStatic.closeOutPosition(tradeId);
        console.log('return amount',formatUnits(usdcAmt,6));
        await exchange.closeOutPosition(tradeId);
        const exhchangePositionAfter = await exchange.positions(0);
        const vammSnapshotAfterClose = await vamm.getLastSnapshot(); 
        const loanPoolUsdcBalAfterClose = await usdc.balanceOf(loanPool.address);
        const interest = await loanPool.callStatic.getInterestOwedForAmount(tradeId,exhchangePosition.loanedAmount);
        console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
        const balanceReward = await vault.callStatic.readBalanceRewards(loanPool.address,2  );
 
      
          
        //usdc balance of loan pool reflect loaned amount
        expect(loanPoolUsdcBalAfter).to.equal(loanPoolUsdcBalAfterClose.sub(exhchangePosition.loanedAmount.add(interest).sub(balanceReward)));
        // //vamm total position size reflect position size
          expect(vammSnapshotAfterClose.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
        //   //vamm cumulative notional reflect loaned amount


        //   //collateral Should be 0
          expect(exhchangePositionAfter.margin).to.equal(0);
        //   //loaned amount Should be 0
          expect(exhchangePositionAfter.loanedAmount).to.equal(0);
        //   //position size Should be 0
          expect(exhchangePositionAfter.positionSize).to.equal(0);
      });
      it("Should open and close long with multiple interest periods", async () => {
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //approve and deposit 100 usdc
        await usdc.approve(vault.address, parseUnits("10000", 6));
        const amount = parseUnits("5000", 6);
        const usdcBalOfUser = await usdc.callStatic.balanceOf(owner.address);
          await vault.deposit(amount);
          const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
          const vammSnapshotBefore = await vamm.getLastSnapshot();
          const collateral = parseUnits("75", 6);          //open position
          await exchange.openPosition(owner.address, vamm.address,collateral,5,1);
          const exhchangePosition = await exchange.positions(0);

          const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
          const vammSnapshotAfter = await vamm.getLastSnapshot();

          //tradeId
          const types = ["address","uint256","int256","address","address"];
          const values = [vamm.address,29,1,owner.address,loanPool.address];
          const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);
        //close position
        mine(60);

        const {avgExitPrice,usdcAmt} = await exchange.callStatic.closeOutPosition(tradeId);
        const interest = await loanPool.callStatic.getInterestOwedForAmount(tradeId,exhchangePosition.loanedAmount);
        await exchange.closeOutPosition(tradeId);
        const exhchangePositionAfter = await exchange.positions(0);
        const vammSnapshotAfterClose = await vamm.getLastSnapshot(); 
        const loanPoolUsdcBalAfterClose = await usdc.balanceOf(loanPool.address);
        // console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
        const balanceReward = await vault.callStatic.readBalanceRewards(loanPool.address,2  );
 
      // console.log('interest',formatUnits(interest,6));
      // console.log('balance reward',formatUnits(balanceReward,6));

          
        //usdc balance of loan pool reflect loaned amount
        expect(loanPoolUsdcBalAfter).to.equal(loanPoolUsdcBalAfterClose.sub(exhchangePosition.loanedAmount.add(interest).sub(balanceReward)));
        // //vamm total position size reflect position size
        const availableBalance = await vault.callStatic.availableBalance(owner.address);
        // await vault.withdraw(availableBalance);
        // console.log('avail bal',formatUnits(availableBalance,6));
        // console.log('usdc amt',formatUnits(usdcAmt,6));
        // console.log('interest',formatUnits(interest,6));
        const userBalAfter = await usdc.callStatic.balanceOf(owner.address);
        // console.log('user bal',formatUnits(usdcBalOfUser,6));
        // console.log('user post bal',formatUnits(userBalAfter,6));
        // console.log('added bal', formatUnits(userBalAfter.add(availableBalance).add(interest).add((exhchangePosition.loanedAmount).div(100)),6));
        // usdc Balance before deposit should be equal to current balance of usdc plus available balance plus interest plus loan fee
        expect(usdcBalOfUser).to.equal(userBalAfter.add(availableBalance).add(interest).add((exhchangePosition.loanedAmount).div(100)));
        // console.log('total pnl',formatUnits(userBalAfter.add(availableBalance).sub(usdcBalOfUser),6));
          
        //   //vamm cumulative notional reflect loaned amount
      });
      it('adding liquidity long',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const collateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 5;
        const user = owner;

        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
        // console.log('tradeId',tradeId);

        const positionBefore = await exchange.positions(0);

        //add liquidity
        const amount = parseUnits("10", 6);

        const newLev = 3;

        await exchange.addLiquidityToPosition(tradeId,amount,newLev,vamm.address);
        // await openPosition(amount,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);


        const positionAfter = await exchange.positions(0);

        const tradeInterest = await vault.tradeInterest(tradeId);
        const tradeCollateral = await vault.tradeCollateral(tradeId);
        const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

        const tradeBalance = await vault.tradeBalance(tradeId);
        const avgPriceToPsize = amount *newLev/positionAfter.entryPrice;
        const positionDiff = (Math.floor(positionAfter.positionSize - positionBefore.positionSize))/1e8;

        const allowedPSizeVariance = 0.00001;
    
        //position size is same as position size before plus new position size
        expect((avgPriceToPsize)-positionDiff).to.lte(allowedPSizeVariance);
        //trade interest is same as trade bal divided by 100
        expect(tradeInterest).to.eq(tradeBalance.div(100));
        //trade bal on vault is same as loaned amount
        expect(tradeBalance).to.eq(positionAfter.loanedAmount);
        //trade bal on vault is same as loaned amount before plus new loan
        expect(tradeBalance).to.eq(positionBefore.loanedAmount.add(amount.mul(newLev)));
       // loan pool shows exact loaned amount
        expect(poolOustandingLoan).to.eq(positionAfter.loanedAmount);
        



        
 
      });
      it('adding liquidity short',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const collateral = parseUnits("75", 6);
        const side = -1;
        const leverage = 5;
        const user = owner;

        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);

        const positionBefore = await exchange.positions(0);

        //add liquidity
        const amount = parseUnits("10", 6);

        const newLev = 3;

        await exchange.addLiquidityToPosition(tradeId,amount,newLev,vamm.address);
        const positionAfter = await exchange.positions(0);

        const tradeInterest = await vault.tradeInterest(tradeId);
        const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

        const tradeBalance = await vault.tradeBalance(tradeId);
        const avgPriceToPsize = amount *newLev/positionAfter.entryPrice*side;
        const positionDiff = (Math.floor(positionAfter.positionSize - positionBefore.positionSize))/1e8;
        const allowedPSizeVariance = 0.00001;
    
        //position size is same as position size before plus new position size
        expect((avgPriceToPsize)-positionDiff).to.lte(allowedPSizeVariance);
        //trade interest is same as trade bal divided by 100
        expect(tradeInterest).to.eq(tradeBalance.div(100));
        //trade bal on vault is same as loaned amount
        expect(tradeBalance).to.eq(positionAfter.loanedAmount);
        //trade bal on vault is same as loaned amount before plus new loan
        expect(tradeBalance).to.eq(positionBefore.loanedAmount.add(amount.mul(newLev)));
       // loan pool shows exact loaned amount
        expect(poolOustandingLoan).to.eq(positionAfter.loanedAmount);
 
      });
      it('adding liquidity long and close all',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const collateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 5;
        const user = owner;

        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);


        //add liquidity
        const amount = parseUnits("10", 6);

        const newLev = 3;

        await exchange.addLiquidityToPosition(tradeId,amount,newLev,vamm.address);
        // await openPosition(amount,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);

        
        await exchange.closeOutPosition(tradeId);
        const tradeInterest = await vault.tradeInterest(tradeId);
        const tradeCollateral = await vault.tradeCollateral(tradeId);
        const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

        const tradeBalance = await vault.tradeBalance(tradeId);

        const position = await exchange.positions(0);
 
        //all above variables should be equal to zero
        expect(tradeInterest).to.eq(0);
        expect(tradeCollateral).to.eq(0);
        expect(poolOustandingLoan).to.eq(0);
        expect(tradeBalance).to.eq(0);
        expect(position.positionSize).to.eq(0);
        expect(position.loanedAmount).to.eq(0);
        expect(position.margin).to.eq(0);
 
      });
      it('adding liquidity short and close all',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const collateral = parseUnits("75", 6);
        const side = -1;
        const leverage = 5;
        const user = owner;

        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);


        //add liquidity
        const amount = parseUnits("10", 6);

        const newLev = 3;

        await exchange.addLiquidityToPosition(tradeId,amount,newLev,vamm.address);
        // await openPosition(amount,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);

        
        await exchange.closeOutPosition(tradeId);
        const tradeInterest = await vault.tradeInterest(tradeId);
        const tradeCollateral = await vault.tradeCollateral(tradeId);
        const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

        const tradeBalance = await vault.tradeBalance(tradeId);

        const position = await exchange.positions(0);
 
        //all above variables should be equal to zero
        expect(tradeInterest).to.eq(0);
        expect(tradeCollateral).to.eq(0);
        expect(poolOustandingLoan).to.eq(0);
        expect(tradeBalance).to.eq(0);
        expect(position.positionSize).to.eq(0);
        expect(position.loanedAmount).to.eq(0);
        expect(position.margin).to.eq(0);
 
      });
      it('adding liquidity long with interest periods',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const initialCollateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 5;
        const user = owner;

        const{tradeId} = await openPosition(initialCollateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
        // console.log('tradeId',tradeId);

        const positionBefore = await exchange.positions(0);
        
        //add liquidity
        const addedCollateral = parseUnits("10", 6);
        
        const newLev = 3;
        mine(30);
        const tradeCollateralRemaing = await vault.calculateCollateral(tradeId);
        const interestOwed = await vault.getInterestOwed(tradeId);

        await exchange.addLiquidityToPosition(tradeId,addedCollateral,newLev,vamm.address);
    
        // all collateral minus interest owed should be equal to current trade collateral
        expect(await vault.tradeCollateral(tradeId)).to.eq(addedCollateral.add(initialCollateral).sub(interestOwed));

      });
      it("adding leverage long",async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("1000", 6);
        const deposit = parseUnits("1000", 6);
        const collateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 3;
        const user = owner;

        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
        const positionBefore = await exchange.positions(0);
        //add liquidity
        const amount = parseUnits("10", 6);

        const newLev = 5;
        const newLoanAmount = collateral.mul(newLev - (leverage));
        const { pSize,  avgEntry,  openValue} = await vamm.callStatic.openPosition(newLoanAmount,1);


        await exchange.addLeverage(tradeId,newLev);
        // await openPosition(amount,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);

        const positionAfter = await exchange.positions(0);
        const tradeInterest = await vault.tradeInterest(tradeId);
        const tradeCollateral = await vault.tradeCollateral(tradeId);
        const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

        const tradeBalance = await vault.tradeBalance(tradeId);
        //equvilent to 0.0001% of position size
        const allowedPSizeVariance = 100;



        const addedPos = parseUnits(Math.floor(1000000*newLoanAmount/370060004).toString(),2);

        // new loan amount should be equal to the difference between the new leverage and the old leverage times the collateral
        expect(positionAfter.loanedAmount).to.be.equal(positionBefore.loanedAmount.add(newLoanAmount));
        //new position size should be equal to the old position size plus the new loan amount mul by the price
        expect(positionAfter.positionSize).to.be.within(positionBefore.positionSize.add(addedPos),positionBefore.positionSize.add(addedPos.add(allowedPSizeVariance)));
        //trade balance should be equal to the loaned amount
        expect(tradeBalance).to.be.equal(positionAfter.loanedAmount);
        //check trade interest
        expect(tradeInterest).to.be.equal(tradeBalance.div(100));
        //check outstading loan
        expect(poolOustandingLoan).to.be.equal(tradeBalance);


    });
    it("adding leverage short",async()=>{
      const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
      //open posiiton function
      const approveAmt = parseUnits("1000", 6);
      const deposit = parseUnits("1000", 6);
      const collateral = parseUnits("75", 6);
      const side = -1;
      const leverage = 3;
      const user = owner;

      const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
      const positionBefore = await exchange.positions(0);
      //add leverage
      
      const newLev = 5;
      const newLoanAmount = collateral.mul(newLev - (leverage));
      const { pSize,  avgEntry,  openValue} = await vamm.callStatic.openPosition(newLoanAmount,1);

      
      await exchange.addLeverage(tradeId,newLev);
      // await openPosition(amount,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);

      const positionAfter = await exchange.positions(0);
      const tradeInterest = await vault.tradeInterest(tradeId);
      const tradeCollateral = await vault.tradeCollateral(tradeId);
      const poolOustandingLoan = await vault.poolOutstandingLoans(loanPool.address);

      const tradeBalance = await vault.tradeBalance(tradeId);
      //equvilent to 0.00001% of position size
      const allowedPSizeVariance = 100;



      const addedPos = parseUnits(Math.floor(1000000*newLoanAmount/369939997).toString(),2);

      // new loan amount should be equal to the difference between the new leverage and the old leverage times the collateral
      expect(positionAfter.loanedAmount).to.be.equal(positionBefore.loanedAmount.add(newLoanAmount));
      //trade balance should be equal to the loaned amount
      expect(tradeBalance).to.be.equal(positionAfter.loanedAmount);
      //new position size should be equal to the old position size plus the new loan amount mul by the price
      expect(positionAfter.positionSize.mul(-1)).to.be.within(positionBefore.positionSize.sub(addedPos).mul(-1),(positionBefore.positionSize.sub(addedPos.add(allowedPSizeVariance)).mul(-1)));
      //check trade interest
      expect(tradeInterest).to.be.equal(tradeBalance.div(100));
      //check outstading loan
      expect(poolOustandingLoan).to.be.equal(tradeBalance);


  });
  it('removing liquidity long',async()=>{
    const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
    //open posiiton function
    const approveAmt = parseUnits("100", 6);
    const deposit = parseUnits("100", 6);
    const collateral = parseUnits("75", 6);
    const side = 1;
    const leverage = 3;
    const user = owner;

    const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
    const positionBefore = await exchange.positions(0);
    const availableBalanceBefore = await vault.availableBalance(owner.address);
    //remove liquidity
    const amountToRemove = Math.floor(positionBefore.positionSize/4)*side;
    const amountRemovedFromLoan = Math.floor(positionBefore.loanedAmount/4);
    const result = await exchange.callStatic.removeLiquidityFromPosition(tradeId,amountToRemove);
    await exchange.removeLiquidityFromPosition(tradeId,amountToRemove);
    const availableBalanceAfter = await vault.availableBalance(owner.address);
    const positionAfter = await exchange.positions(0);
    //equvilent to 0.0000001 USDC
    const deveationAllowance = 10;
    //test that the position size is equal to the old position size minus the amount removed
    expect(positionAfter.positionSize).to.be.equal(positionBefore.positionSize.sub(amountToRemove));
    //test that the available balance is equal to the old available balance plus the pnl from the removed amount
    expect(availableBalanceAfter).to.be.equal(availableBalanceBefore.add(result._pnl));
    //check new loaned amount
    expect(positionAfter.loanedAmount).to.be.within(positionBefore.loanedAmount.sub(amountRemovedFromLoan),positionBefore.loanedAmount.sub(amountRemovedFromLoan).add(deveationAllowance));
    //check new min marg should be equal to 1% of the current loaned amount
    expect(result._newMinMarg).to.be.equal(positionAfter.loanedAmount.div(100));
    //check loan pool outstanding loan shoulkd be equal to the new loaned amount
    expect(await loanPool.loanedUsdc()).to.be.equal(positionAfter.loanedAmount);
});
it('removing liquidity short',async()=>{
  const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
  //open posiiton function
  const approveAmt = parseUnits("100", 6);
  const deposit = parseUnits("100", 6);
  const collateral = parseUnits("75", 6);
  const side = -1;
  const leverage = 3;
  const user = owner;

  const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
  const positionBefore = await exchange.positions(0);
  const availableBalanceBefore = await vault.availableBalance(owner.address);
  const tradeCollateralBefore = await vault.tradeCollateral(tradeId);
  //remove liquidity
  const amountToRemove = Math.floor(positionBefore.positionSize/4);
  const amountRemovedFromLoan = Math.floor(positionBefore.loanedAmount/4);
  const result = await exchange.callStatic.removeLiquidityFromPosition(tradeId,amountToRemove);
  await exchange.removeLiquidityFromPosition(tradeId,amountToRemove);
  const availableBalanceAfter = await vault.availableBalance(owner.address);
  const positionAfter = await exchange.positions(0);
  const tradeCollateralAfter = await vault.tradeCollateral(tradeId);

  //pnl is negative so takes from trade collateral and does not add/subtract from available balance
  //equvilent to 0.0000001 USDC
  const deveationAllowance = 10;
  //test that the position size is equal to the old position size minus the amount removed
  expect(positionAfter.positionSize).to.be.equal(positionBefore.positionSize.sub(amountToRemove));
  //test that the available balance is equal to the old available balance plus the pnl from the removed amount
  expect(availableBalanceAfter).to.be.equal(availableBalanceBefore);
  //check new loaned amount
  expect(positionAfter.loanedAmount).to.be.within(positionBefore.loanedAmount.sub(amountRemovedFromLoan),positionBefore.loanedAmount.sub(amountRemovedFromLoan).add(deveationAllowance));
  //check new min marg should be equal to 1% of the current loaned amount
  expect(result._newMinMarg).to.be.equal(positionAfter.loanedAmount.div(100));
  //check loan pool outstanding loan shoulkd be equal to the new loaned amount
  expect(await loanPool.loanedUsdc()).to.be.equal(positionAfter.loanedAmount);
  //check collateral
  expect(tradeCollateralAfter).to.be.equal(tradeCollateralBefore.add(result._pnl));
  
});
});

