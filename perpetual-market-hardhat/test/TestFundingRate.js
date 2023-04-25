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
describe("Funding Rate", async () => {
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
    it('should calculate funding rate', async () => {
        const {usdc, owner, otherAccount, thirdAccount,loanPool,vault,vamm,exchange,oracle} = await loadFixture(deployContracts);
        const approveAmt = parseUnits("100", 6);
        const deposit = parseUnits("100", 6);
        const collateral = parseUnits("75", 6);
        const side = 1;
        const leverage = 3;
        const user = owner;
      
        const{tradeId} = await openPosition(collateral,deposit, approveAmt, side,leverage, user, vault, exchange, vamm,loanPool,usdc);
        // mine(10);
        await vamm.setIndexPrice(parseUnits("390", 6));
        const cumulativeFundingRate = await exchange.callStatic.getTotalFundingRate(tradeId);
        console.log("cumulativeFundingRate",cumulativeFundingRate);
        const newCollateral = await vault.callStatic.calculateCollateral(tradeId);
        console.log("newCollateral",newCollateral);
        // await exchange.closePosition(otherAccount.address,tradeId);
        
    });
});
