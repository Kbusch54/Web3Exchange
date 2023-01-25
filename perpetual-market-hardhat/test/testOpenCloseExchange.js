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
      const quoteAsset = parseUnits("100", 6);
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
      it.skip("Should open position and borrow", async () => {
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
      it.skip("Should close position and repay", async () => {
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
      it.skip('Should open and borrow with short', async () => {
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
          await exchange.openPosition(owner.address, vamm.address,collateral,5,-1);
          const exhchangePosition = await exchange.positions(0);

          const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
          const vammSnapshotAfter = await vamm.getLastSnapshot();
          console.log('avail bal',formatUnits(await vault.callStatic.availableBalance(owner.address),6));
          //tradeId
          const types = ["address","uint256","int256","address","address"];
          const values = [vamm.address,29,1,owner.address,loanPool.address];
          const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);

          //usdc balance of loan pool reflect loaned amount
        expect(loanPoolUsdcBalBefore).to.equal(loanPoolUsdcBalAfter.add(exhchangePosition.loanedAmount));
        //vamm total position size reflect position size
        expect(vammSnapshotBefore.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
        // //vamm cumulative notional reflect loaned amount
        expect(vammSnapshotBefore.cumulativeNotional).to.equal(vammSnapshotAfter.cumulativeNotional.add(exhchangePosition.loanedAmount));
        // // open value Should match position size * price
        expect(exhchangePosition.openValue).to.equal(exhchangePosition.positionSize.mul(await vamm.getAssetPrice()).div(1e8).mul(-1));
      });
      it.skip('Should close and repay with short', async () => {
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
      it.skip("Should open and close long with multiple interest periods", async () => {
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
      it('adding liquidity ',async()=>{
        const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
        //open posiiton function
        const approveAmt = parseUnits("100", 6);
        const deposit = parseUnits("100", 6);
        const collateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 5;
        const user = owner;
        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
        // console.log('tradeId',tradeId);
        console.log('positions',await exchange.positions(0));
        console.log('position index by tradeId',await exchange.positionsbyTradeId(tradeId));
        console.log('is trade active',await exchange.isTradeActive(tradeId));

        
 
      });

    });