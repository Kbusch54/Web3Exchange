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

describe("Claiming Rewards check", async () => {
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
    //   await usdc.transfer(thirdAccount.address, parseUnits("1000", 6));
      await usdc.mintAndTransfer( parseUnits("10000", 6),otherAccount.address);
      await usdc.mintAndTransfer( parseUnits("10000", 6),thirdAccount.address);
      await usdc.approve(loanPool.address, parseUnits("1000", 6));
      await usdc.connect(otherAccount).approve(loanPool.address, parseUnits("1000", 6));
      await usdc.connect(thirdAccount).approve(loanPool.address, parseUnits("1000", 6));
      await loanPool.connect(otherAccount).stake(parseUnits("500", 6));
      mine(5)
      await loanPool.connect(thirdAccount).stake(parseUnits("250", 6));
      await loanPool.stake(parseUnits("1000", 6));
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
    it("should show on current index half the interest payed in both struct and from usdcSupply", async () => {
        const {usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle} = await loadFixture(deployContracts);
        const collateral = parseUnits("100", 6);
        const deposit = parseUnits("250", 6);
        const approveAmt = parseUnits("10000", 6);
        const side = 1;
        const leverage = 2;
        const loanPoolUsdcBal = await usdc.balanceOf(loanPool.address);
        const {tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, owner, vault, exchange, vamm,loanPool,usdc);
        mine(20);
        const interestOwed = await vault.callStatic.getInterestOwed(tradeId);
        const expectedPnl = interestOwed.div(2);
        await exchange.closeOutPosition(tradeId);
        const snapIndex = await loanPool.callStatic.getCurrentindex();
        const currentSnapshot = await loanPool.callStatic.getSnapshot(snapIndex);
        const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
        expect(currentSnapshot.pnlRemaining).to.equal(expectedPnl);
        expect(currentSnapshot.pnlForSnapshot).to.equal(interestOwed);
        expect(currentSnapshot.pnlForReward).to.equal(expectedPnl);
        expect(loanPoolUsdcBalAfter).to.equal(loanPoolUsdcBal.add(expectedPnl));
    });
    it("should show on current index half the interest payed in both struct and from usdcSupply short", async () => {
        const {usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle} = await loadFixture(deployContracts);
        const collateral = parseUnits("100", 6);
        const deposit = parseUnits("250", 6);
        const approveAmt = parseUnits("10000", 6);
        const side = -1;
        const leverage = 2;
        const loanPoolUsdcBal = await usdc.balanceOf(loanPool.address);
        const {tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, owner, vault, exchange, vamm,loanPool,usdc);
        mine(20);
        const interestOwed = await vault.callStatic.getInterestOwed(tradeId);
        const expectedPnl = interestOwed.div(2);
        await exchange.closeOutPosition(tradeId);
        const snapIndex = await loanPool.callStatic.getCurrentindex();
        const currentSnapshot = await loanPool.callStatic.getSnapshot(snapIndex);
        const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
        expect(currentSnapshot.pnlRemaining).to.equal(expectedPnl);
        expect(currentSnapshot.pnlForSnapshot).to.equal(interestOwed);
        expect(currentSnapshot.pnlForReward).to.equal(expectedPnl);
        expect(loanPoolUsdcBalAfter).to.equal(loanPoolUsdcBal.add(expectedPnl));
    });
    it('should allow for stakers to claim rewards', async () => {
        const {usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle} = await loadFixture(deployContracts);
        const collateral = parseUnits("100", 6);
        const deposit = parseUnits("250", 6);
        const approveAmt = parseUnits("10000", 6);
        const side = 1;
        const leverage = 10;
        const {tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, owner, vault, exchange, vamm,loanPool,usdc);
        mine(40);
        await exchange.closeOutPosition(tradeId);
        mine(10);
        const snapIndex = await loanPool.callStatic.getCurrentindex();
        const currentSnapshot = await loanPool.callStatic.getSnapshot(snapIndex);
        const expectedPnl = currentSnapshot.pnlForReward;
        const otherAccountStake = await loanPool.callStatic.balanceOf(otherAccount.address);
        const thirdAccountStake = await loanPool.callStatic.balanceOf(thirdAccount.address);
        const ownerAccStake = await loanPool.callStatic.balanceOf(owner.address);
        const totalSupply = await loanPool.callStatic.totalSupply();
        const otherBal = await usdc.balanceOf(otherAccount.address);
        const thirdBal = await usdc.balanceOf(thirdAccount.address);
        const ownerBal = await usdc.balanceOf(owner.address);
        const otherAccStakePercentage = otherAccountStake*1000000/totalSupply;
        const thirdAccStakePercentage = thirdAccountStake*1000000/totalSupply;
        const ownerAccStakePercentage =  ownerAccStake*1000000/totalSupply;
        const remainingInVault1 = await vault.callStatic.balancesForRewards(loanPool.address,snapIndex);
        await loanPool.connect(otherAccount).claimReward();
        await loanPool.connect(thirdAccount).claimReward();
        await loanPool.claimReward();
        const otherBalAfter = await usdc.balanceOf(otherAccount.address);
        const thirdBalAfter = await usdc.balanceOf(thirdAccount.address);
        const ownerBalAfter = await usdc.balanceOf(owner.address);
        const expectedPnlOther = Math.floor(expectedPnl*otherAccStakePercentage/1000000);
        const expectedPnlThird = Math.floor(expectedPnl*thirdAccStakePercentage/1000000);
        const expectedPnlOwner = Math.floor(expectedPnl*ownerAccStakePercentage/1000000);
        expect(otherBalAfter).to.equal(otherBal.add(expectedPnlOther));
        expect(thirdBalAfter).to.equal(thirdBal.add(expectedPnlThird));
        expect(ownerBalAfter).to.equal(ownerBal.add(expectedPnlOwner));
        const currSnap = await loanPool.callStatic.getSnapshot(snapIndex);
        expect(currSnap.pnlRemaining).to.be.within(0,1);
        expect(currSnap.tokensClaimed).to.equal(currSnap.totalTokenSupply);
        const remainingInVault = await vault.callStatic.balancesForRewards(loanPool.address,snapIndex);
        expect(remainingInVault).to.be.within(0,1);
    });
    it('it should rollover unclaimed rewards to next snapshot', async () => {
        const {usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle} = await loadFixture(deployContracts);
        const collateral = parseUnits("100", 6);
        const deposit = parseUnits("250", 6);
        const approveAmt = parseUnits("10000", 6);
        const side = 1;
        const leverage = 10;
        const {tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, owner, vault, exchange, vamm,loanPool,usdc);
        mine(40);
        await exchange.closeOutPosition(tradeId);
        mine(10);
        const snapIndex = await loanPool.callStatic.getCurrentindex();
        const currentSnapshot = await loanPool.callStatic.getSnapshot(snapIndex);
        const expectedPnl = currentSnapshot.pnlForReward;
        const ownerAccStake = await loanPool.callStatic.balanceOf(owner.address);
        const totalSupply = await loanPool.callStatic.totalSupply();
        const ownerAccStakePercentage =  ownerAccStake*1000000/totalSupply;
        await loanPool.connect(otherAccount).claimReward();
        await loanPool.connect(thirdAccount).claimReward();
        const expectedPnlOwner = Math.floor(expectedPnl*ownerAccStakePercentage/1000000);
        const currSnap = await loanPool.callStatic.getSnapshot(snapIndex);
        expect(currSnap.pnlRemaining).to.be.within(expectedPnlOwner,expectedPnlOwner + 1);
        expect(currSnap.tokensClaimed).to.equal(currSnap.totalTokenSupply.sub(ownerAccStake));
        const remainingInVault = await vault.callStatic.balancesForRewards(loanPool.address,snapIndex);
        expect(remainingInVault).to.be.within(expectedPnlOwner,expectedPnlOwner+1);
        mine(10);
         await openPosition(collateral,deposit, approveAmt, side,leverage, owner, vault, exchange, vamm,loanPool,usdc);
         const tradeId2 = '0x0000000000000000000000009fe46736679d2d9a65f0992f2272de9f3c7fa6e0000000000000000000000000000000000000000000000000000000000000005d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512';
        mine(40);
        await exchange.closeOutPosition(tradeId2);
        mine(10);
        const usdcOfPool = await usdc.balanceOf(loanPool.address);
        const snapIndex2 = await loanPool.callStatic.getCurrentindex();
        const currentSnapshot2 = await loanPool.callStatic.getSnapshot(snapIndex2);
        await loanPool.claimReward();
        const usdcBalOfPoolAfter = await usdc.balanceOf(loanPool.address)
        expect(usdcBalOfPoolAfter).to.be.within(usdcOfPool.add(expectedPnlOwner),usdcOfPool.add(expectedPnlOwner).add(1));
    });
});