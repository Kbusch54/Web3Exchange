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
    const [owner, otherAccount, vaultAdd] = await ethers.getSigners();
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
    const StakingPool = await ethers.getContractFactory("StakingPoolAmm");
    const usdcAdd = usdc.address;
    const stakingPool = await StakingPool.deploy('ammPool token','pTok', usdcAdd);

    // return { usdc, owner, otherAccount, stakingPool, vaultAdd };
    return{usdc, owner, otherAccount, vaultAdd,stakingPool}
  }
  it.skip("it should allow stake", async () => {
    const { usdc, owner, otherAccount, stakingPool, vaultAdd } =await loadFixture(deployContracts);

    await usdc.approve(stakingPool.address, parseUnits("100", 6));
    await stakingPool.stake(parseUnits("100", 6));

    expect(await stakingPool.balanceOf(owner.address)).to.equal(100000000);
  });
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
});
