const { expect,chai } = require("chai");

const { ethers } = require("hardhat");
const hre = require("hardhat");
const { loadFixture,mine,takeSnapshot } = require("@nomicfoundation/hardhat-network-helpers");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits,
} = require("ethers/lib/utils");
const { latestBlock } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");

describe("LoanPool FakeVault", async () => {
    async function deployContracts() {
      const [owner, otherAccount, thirdAccount,oracle] = await ethers.getSigners();
      const FakeCurrency = await ethers.getContractFactory("FakeErc20");
      const name = "Fake USDC";
      const decimals = 6;
      const symbol = "USDC";
      const usdc = await FakeCurrency.deploy(
        100000000000,
        name,
        symbol,
        decimals
      );
      const LoanPool = await ethers.getContractFactory("LoanPool");
      const usdcAdd = usdc.address;
      const loanPool = await LoanPool.deploy('ammPool token','pTok', usdcAdd);
  
      const VaultMain = await ethers.getContractFactory("VaultMain");
      const VAMM = await ethers.getContractFactory("VAmm");
      const vamm = await VAMM.deploy();
      const LoanArray = [loanPool.address];
      const vault = await VaultMain.deploy(usdc.address,LoanArray,thirdAccount.address);
      const path = "events/json/appl";
      
      
      const VammArray = [vamm.address];
      
      const Exchange = await ethers.getContractFactory("Exchange");
      const exchange = await Exchange.deploy(VammArray,vault.address);
      await exchange.registerPool(vamm.address,loanPool.address);
      vault.updateExchange(exchange.address);
      // const assetAddress = "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3";
      const indexPrice = parseUnits("370", 6);
      const quoteAsset = parseUnits("5", 4);
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
  
      return{usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle}
      
    }
      it("should open position and borrow", async () => {
          const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle } =await loadFixture(deployContracts);
          console.log("vault balance",formatUnits(await vault.availableBalance(owner.address),6))  
          await usdc.approve(vault.address, parseUnits("1000", 6));
          const amount = parseUnits("100", 6);
            await vault.deposit(amount);

            console.log('loan pool usdc balance',formatUnits(await usdc.balanceOf(loanPool.address),6));
            const loanPoolUsdcBalBefore = await usdc.balanceOf(loanPool.address);
            const vammSnapshotBefore = await vamm.getLastSnapshot();
            const collateral = parseUnits("75", 6);

            await exchange.openPosition(owner.address, vamm.address,collateral,5,1);
            const exhchangePosition = await exchange.positions(0);
            console.log('loan pool usdc balance',formatUnits(await usdc.balanceOf(loanPool.address),6));
            const loanPoolUsdcBalAfter = await usdc.balanceOf(loanPool.address);
            const vammSnapshotAfter = await vamm.getLastSnapshot();
            const types = ["address","uint256","int256","address","address"];
            const values = [vamm.address,29,1,owner.address,loanPool.address];
            const tradeId = ethers.utils.defaultAbiCoder.encode(types,values);
            console.log(tradeId);

          expect(loanPoolUsdcBalBefore).to.equal(loanPoolUsdcBalAfter.add(exhchangePosition.loanedAmount));
          expect(vammSnapshotBefore.totalPositionSize).to.equal(vammSnapshotAfter.totalPositionSize.sub(exhchangePosition.positionSize));
          expect(vammSnapshotBefore.cumulativeNotional).to.equal(vammSnapshotAfter.cumulativeNotional.sub(exhchangePosition.loanedAmount));
          expect(exhchangePosition.openValue).to.equal(exhchangePosition.positionSize.mul(await vamm.getAssetPrice()).div(1e8));

          console.log('collateral calc',await vault.callStatic.calculateCollateral(tradeId));
      });
    });