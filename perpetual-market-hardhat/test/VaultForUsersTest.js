const { expect } = require("chai");

const { ethers } = require("hardhat");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { int } = require("hardhat/internal/core/params/argumentTypes");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits,
} = require("ethers/lib/utils");

describe("VaultForUsers testing erc20 usdc functions", async () => {
  async function deployVaultFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
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
    const VaultForUsers = await ethers.getContractFactory("VaultForUsers");
    const vault = await VaultForUsers.deploy();
    const vaultAdd = vault.address;
    const UsdcController = await ethers.getContractFactory("USDCController");
    const usdcAdd = usdc.address;
    const controller = await UsdcController.deploy(vaultAdd, usdcAdd);
    await vault.updateUSDCAdd(usdcAdd);
    await vault.updateControllerAdd(controller.address);

    return { usdc, owner, otherAccount, controller, vault };
  }
  it("allows deposits", async () => {
    const { usdc, owner, otherAccount, controller, vault } = await loadFixture(
      deployVaultFixture
    );

    await usdc.approve(vault.address, parseUnits("100", 6));
    await vault.deposit(parseUnits("100", 6));
    const postUSDCBal = await usdc.balanceOf(vault.address);
    const postTotalUsdc = await vault.totalUsdc();
    const postUSDCOwnedByUsers = await vault.usdcOwnedByUsers();
    await vault.checkUsdcBal();
    expect(postUSDCBal).to.be.eq(postTotalUsdc);
    expect(postUSDCOwnedByUsers).to.be.eq(postTotalUsdc);
  });
  it("Allows Withdraws and updates accordingly", async () => {
    const { usdc, owner, otherAccount, controller, vault } = await loadFixture(
      deployVaultFixture
    );

    await usdc.approve(vault.address, parseUnits("100", 6));
    await vault.deposit(parseUnits("100", 6));

    const prevUserBal = await usdc.balanceOf(owner.address);
    const prevUSDCBal = await usdc.balanceOf(vault.address);
    const prevTotalUsdc = await vault.totalUsdc();
    const prevUSDCOwnedByUsers = await vault.usdcOwnedByUsers();

    //cut in half
    await vault.withdraw(parseUnits("50", 6));

    await vault.checkUsdcBal();

    expect(prevUserBal).to.be.eq(
      (await usdc.balanceOf(owner.address)).sub(parseUnits("50", 6))
    );
    expect(prevUSDCBal).to.be.eq(
      (await usdc.balanceOf(vault.address)).add(parseUnits("50", 6))
    );
    expect(prevTotalUsdc).to.be.eq(
      (await vault.totalUsdc()).add(parseUnits("50", 6))
    );
    expect(prevUSDCOwnedByUsers).to.be.eq(
      (await vault.usdcOwnedByUsers()).add(parseUnits("50", 6))
    );

    //withdraw rest
    await vault.withdraw(parseUnits("50", 6));
    const postUserBal = await usdc.balanceOf(owner.address);
    const postUSDCBal = await usdc.balanceOf(vault.address);
    const postTotalUsdc = await vault.totalUsdc();
    const postUSDCOwnedByUsers = await vault.usdcOwnedByUsers();
    await vault.checkUsdcBal();

    expect(postTotalUsdc).to.be.eq(0);
    expect(prevUserBal).to.be.eq(postUserBal.sub(parseUnits("100", 6)));
    expect(postUSDCBal).to.be.eq(0);
    expect(postUSDCOwnedByUsers).to.be.eq(0);
  });
});
