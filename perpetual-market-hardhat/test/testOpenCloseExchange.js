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
      const vammArray = [vamm.address];
      const vault = await VaultMain.deploy(usdc.address,vammArray,interestPayer.address);
      const path = "events/json/appl";
      
      
      
      
      const Exchange = await ethers.getContractFactory("Exchange");
      const exchange = await Exchange.deploy(vammArray,vault.address);
      vault.updateExchange(exchange.address);
      // const assetAddress = "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3";
      const indexPrice = parseUnits("370", 6);
      const quoteAsset = parseUnits("5", 4);
      const indexPricePeriod = 2;
  
      await vamm.init(oracle,path, indexPrice, quoteAsset, indexPricePeriod,exchange.address,oracle);







      await loanPool.updateVault(vault.address);
  
      await usdc.transfer(interestPayer.address, parseUnits("1000", 6));
      await usdc.mintAndTransfer( parseUnits("10000", 6),otherAccount.address);
      await usdc.mintAndTransfer( parseUnits("10000", 6),thirdAccount.address);
      await usdc.approve(loanPool.address, parseUnits("1000", 6));
      await usdc.connect(otherAccount).approve(loanPool.address, parseUnits("100", 6));
      await usdc.connect(thirdAccount).approve(loanPool.address, parseUnits("120", 6));
      await loanPool.connect(otherAccount).stake(parseUnits("80", 6));
      await loanPool.receiveUSDC(parseUnits("2", 3));
      mine(5)
      await loanPool.connect(thirdAccount).stake(parseUnits("120", 6));
      await loanPool.stake(parseUnits("100", 6));
  
      mine(2)
  
      return{usdc, owner, otherAccount, thirdAccount,loanPool,vault,interestPayer,vamm,exchange,oracle}
      
    }
      it.skip("should open position and borrow", async () => {
          const { usdc, owner, otherAccount, thirdAccount,loanPool,vault,interestPayer,vamm,exchange,oracle } =await loadFixture(deployContracts);
            const amount = parseUnits("100", 6);
            
     
  
      });
    });