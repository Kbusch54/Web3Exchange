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

describe("PoolUsdc", async () => {
  async function deployContracts() {
    const [owner, otherAccount, vaultAdd,interestPayer] = await ethers.getSigners();
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
    const StakingPool = await ethers.getContractFactory("LoanPool");
    const usdcAdd = usdc.address;
    const stakingPool = await StakingPool.deploy('ammPool token','pTok', usdcAdd);

    const FakeVault = await ethers.getContractFactory("FakeVault");
    const vault = await FakeVault.deploy(usdc.address,stakingPool.address);
    await stakingPool.updateVault(vault.address);

    await usdc.transfer(interestPayer.address, parseUnits("1000", 6));

    // return { usdc, owner, otherAccount, stakingPool, vaultAdd };
    return{usdc, owner, otherAccount, vaultAdd,stakingPool,vault,interestPayer}
  }
  it.skip("it should allow stake", async () => {
    const { usdc, owner, otherAccount, stakingPool, vaultAdd } =await loadFixture(deployContracts);

    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));

    expect(await stakingPool.balanceOf(owner.address)).to.equal(100000000);
  })
  ;
  it.skip("it should allow withdraw", async () => {
    const { usdc, owner, otherAccount, stakingPool, vaultAdd } =await loadFixture(deployContracts);

    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
    await stakingPool.withdrawStake(parseUnits("100", 6));
    const tokBal = await stakingPool.balanceOf(owner.address);


    expect(tokBal).to.equal(0);
  });
  it.skip('should revert if withdraw more than staked', async () => {
    const { usdc, owner, otherAccount, stakingPool, vaultAdd } =await loadFixture(deployContracts);

    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
    const tokenBal = await stakingPool.balanceOf(owner.address);

    await expect(stakingPool.withdrawStake(tokenBal +100000)).to.be.revertedWith('You cannot unstake more tokens than you have');
  });
  it.skip("snapshots claim reward revert", async () => {
    const { usdc, owner, otherAccount, stakingPool, vaultAdd } =await loadFixture(deployContracts);

    await usdc.transfer(otherAccount.address, parseUnits("100", 6));
    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await usdc.connect(otherAccount).approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.connect(otherAccount).stake(parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
    await expect(stakingPool.connect(otherAccount).claimReward()).to.be.revertedWith('Current Pnl is 0 or negative');
  });
  //no longer works will test this functionality with loanPool now
  it.skip("snapshots claim reward", async () => {
    const { usdc, owner, otherAccount, stakingPool, vault,interestPayer } =await loadFixture(deployContracts);

    //transfering usdc to other account
    await usdc.transfer(otherAccount.address, parseUnits("100", 6));
    //approving staking pool to take usdc and staking
    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await usdc.connect(otherAccount).approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.connect(otherAccount).stake(parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
  
    //mining blocks
    await mine(5);
    
    //staking again
    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));
    //simulate an interest payemtn to vault which affects the pnl
    await usdc.connect(interestPayer).approve(vault.address, parseUnits("100", 6));



    //crteate fake _tradeID to simulate a trade
    const tradeID = ethers.utils.formatBytes32String("tradeID");
    await vault.connect(interestPayer).deposit(parseUnits("100", 6));
    await vault.connect(interestPayer).secureLoanAndTrade(tradeID,10,parseUnits("10", 6));
    await vault.testTradeCollateral(tradeID,parseUnits("100", 6));
    /////////////////////////////////////////////////////////////////////////////////////
    await vault.connect(interestPayer).recordInterest(tradeID,parseUnits("100", 6));
    /////////////////////////////////////////////////////////////////////////////////////
    console.log('made it here');

    //mining blocks
    mine(13);
    //snapshot before claim
    const snapshotBeforeClaim = await stakingPool.callStatic.snapshots(1);
    //usdc balance before claim
    const usdcBalBefore = await usdc.callStatic.balanceOf(owner.address);
    const usdcBalBeforeAcc2 = await usdc.callStatic.balanceOf(otherAccount.address);
    //claiming reward
    await stakingPool.claimReward();
    await stakingPool.connect(otherAccount).claimReward();
    //mining blocks
    mine(3)
    //usdc balance after claim
    const usdcBalAfter = await usdc.callStatic.balanceOf(owner.address);
    const usdcBalAfterAcc2 = await usdc.callStatic.balanceOf(otherAccount.address);


    //snapshot after claim
    const snapshotAfterClaim = await stakingPool.callStatic.snapshots(1);

    //expectations
    expect(usdcBalAfter).to.equal(usdcBalBefore.add(25000000));
    expect(usdcBalAfterAcc2).to.equal(usdcBalBeforeAcc2.add(25000000));
    expect(snapshotAfterClaim.pnlRemaining).to.equal(0);
    expect(snapshotAfterClaim.pnlRemaining).to.equal(snapshotBeforeClaim.pnlRemaining.sub(usdcBalAfterAcc2.sub(usdcBalBeforeAcc2)).sub(usdcBalAfter.sub(usdcBalBefore)));

  });
});
