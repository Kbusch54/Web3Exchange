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
    const [owner, otherAccount, thirdAccount,interestPayer] = await ethers.getSigners();
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

    const FakeVault = await ethers.getContractFactory("FakeVault");
    const vault = await FakeVault.deploy(usdc.address,loanPool.address);
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

    return{usdc, owner, otherAccount, thirdAccount,loanPool,vault,interestPayer}
    
  }
    it("should allow deposit", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const usdcBalBefore = await usdc.balanceOf(owner.address);
        console.log('loanpool address',loanPool.address);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const vaultBal = await vault.availableBalance(owner.address);
        expect(vaultBal).to.equal(depositAmount);
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await usdc.balanceOf(owner.address)).to.equal(usdcBalBefore.sub(depositAmount));

    });
    it.skip("should allow withdraw", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const usdcBalBefore = await usdc.balanceOf(owner.address);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        await vault.withdraw(depositAmount);
        const vaultBal = await vault.availableBalance(owner.address);
        expect(vaultBal).to.equal(0);
        expect(await usdc.balanceOf(vault.address)).to.equal(0);
        expect(await usdc.balanceOf(owner.address)).to.equal(usdcBalBefore);
    });
    it.skip("should allow borrow", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const borrowAmount = parseUnits("10", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await vault.secureLoanAndTrade(tradeID,10, borrowAmount);
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter.add(borrowAmount));
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
    });
    it.skip("should allow repay", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const borrowAmount = parseUnits("10", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await vault.secureLoanAndTrade(tradeID,10, borrowAmount);
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter.add(borrowAmount));
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
        const loanAmount = await loanPool.loanDebt(tradeID);
        const interestPayment = await vault.getInterestOwed(tradeID);
        await vault.repayLoan(tradeID,loanAmount);
        // await vault.exitPosition(tradeID);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(interestPayment));
    });
    it.skip("should allow repay with interest scaled", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const borrowAmount = parseUnits("10", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await vault.secureLoanAndTrade(tradeID,10, borrowAmount);
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter.add(borrowAmount));
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
        mine(30);
        const loanAmount = await loanPool.loanDebt(tradeID);
        const interestPayment = await vault.getInterestOwed(tradeID);
        await vault.repayLoan(tradeID,loanAmount);
        // await vault.exitPosition(tradeID);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(interestPayment));
    });
    it.skip("should allow repay with interest scaled with minor payments", async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const borrowAmount = parseUnits("10", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await vault.secureLoanAndTrade(tradeID,10, borrowAmount);
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter.add(borrowAmount));
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
        mine(30);
        const loanAmount = await loanPool.loanDebt(tradeID);
        const interestPayment = await vault.getInterestOwed(tradeID);
        await vault.repayLoan(tradeID,loanAmount/2);
        console.log('interest for half payment 30 blocks', formatUnits(interestPayment,6))

        mine(12);
        const usdcBalBefore = await usdc.balanceOf(otherAccount.address);
        await loanPool.connect(otherAccount).claimReward();
        const usdcBalAfter = await usdc.balanceOf(otherAccount.address);
        
        const usdcBalBeforeThird = await usdc.balanceOf(thirdAccount.address);
        await loanPool.connect(thirdAccount).claimReward();
        const usdcBalBeforeOwner = await usdc.balanceOf(owner.address);
        await loanPool.claimReward();
        const usdcBalAfterowner = await usdc.balanceOf(owner.address);
        const usdcBalAfterThird = await usdc.balanceOf(thirdAccount.address);
        console.log('token bal thirdAcc: ', await loanPool.balanceOf(thirdAccount.address))
        console.log('token bal otherAcc: ', await loanPool.balanceOf(otherAccount.address))
        console.log('token bal owner: ', await loanPool.balanceOf(owner.address))
        console.log('usdc reward2: ', formatUnits(usdcBalAfter.sub(usdcBalBefore),6))
        console.log('usdc reward thirdAcc: ', formatUnits(usdcBalAfterThird.sub(usdcBalBeforeThird),6))
        console.log('usdc reward owner: ', formatUnits(usdcBalAfterowner.sub(usdcBalBeforeOwner),6))
        console.log('snapshot:',await loanPool.snapshots(2))
        mine(50);
        const interestPayment2 = await vault.getInterestOwed(tradeID);
        console.log('interest for half payment 60 blocks', formatUnits(interestPayment2,6))
        const loanAmount2 = await loanPool.loanDebt(tradeID);
        await vault.repayLoan(tradeID,loanAmount2);

        mine(13);
        const usdcBalBefore1 = await usdc.balanceOf(otherAccount.address);
        await loanPool.connect(otherAccount).claimReward();
        const usdcBalAfter1 = await usdc.balanceOf(otherAccount.address);

        console.log('usdc reward1: ', formatUnits(usdcBalAfter1.sub(usdcBalBefore1),6))
       
        
        // await vault.exitPosition(tradeID);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(interestPayment).sub(interestPayment2));
    });
    it.skip('Should revert loan if max loan reached', async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await expect(vault.secureLoanAndTrade(tradeID,10, depositAmount)).to.be.revertedWith('LoanPool: Max loan reached');
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter);
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore);
    });
    it.skip('Should revert if over paying borrow amount', async () => {
        const { usdc, owner, otherAccount, loanPool, thirdAccount,vault,interestPayer } =await loadFixture(deployContracts);
        const depositAmount = parseUnits("100", 6);
        const borrowAmount = parseUnits("10", 6);
        await usdc.approve(vault.address, depositAmount);
        await vault.deposit(depositAmount);
        const userVaultBalBefore = await vault.availableBalance(owner.address);
        const tradeID = ethers.utils.formatBytes32String("tradeID");
        await vault.secureLoanAndTrade(tradeID,10, borrowAmount);
        const vaultBalAfter = await vault.availableBalance(owner.address);
        expect(userVaultBalBefore).to.equal(vaultBalAfter.add(borrowAmount));
        expect(await usdc.balanceOf(vault.address)).to.equal(depositAmount);
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
        const loanAmount = await loanPool.loanDebt(tradeID);
        await expect(vault.repayLoan(tradeID,loanAmount.add(1))).to.be.revertedWith('LoanPool: Amount to repay exceeds loan'); 
        expect(await vault.availableBalance(owner.address)).to.equal(userVaultBalBefore.sub(borrowAmount));
    });
    

});