const { expect } = require("chai");

const { ethers } = require("hardhat");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("FakeCurrency", async () => {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const FakeCurrency = await ethers.getContractFactory("FakeErc20");
    const name = "Fake USDC";
    const decimals = 6;
    const symbol = "USDC";
    const fakeCurrency = await FakeCurrency.deploy(
      1000000000,
      name,
      symbol,
      decimals
    );

    return { fakeCurrency, owner, otherAccount };
  }

  it("should allow the owner to mint additional tokens", async () => {
    const { fakeCurrency, owner, otherAccount } = await loadFixture(
      deployOneYearLockFixture
    );
    const initialSupply = await fakeCurrency.totalSupply();

    const initialBalance = await fakeCurrency.balanceOf(owner.address);

    await fakeCurrency.mint(1000);

    const newSupply = await fakeCurrency.totalSupply();
    const newBalance = await fakeCurrency.balanceOf(owner.address);

    expect(newSupply).to.equal(initialSupply.add(1000));
    expect(newBalance).to.equal(initialBalance.add(1000));
  });
  it("should not allow non-owners to mint tokens", async () => {
    const { fakeCurrency, owner, otherAccount } = await loadFixture(
      deployOneYearLockFixture
    );
    await expect(
      fakeCurrency.connect(otherAccount).mint(1000)
    ).to.be.revertedWith("Only the owner can mint tokens");
  });
  it("should allow new owner to be added", async () => {
    const { fakeCurrency, owner, otherAccount } = await loadFixture(
      deployOneYearLockFixture
    );
    await fakeCurrency.addOwner(otherAccount.address);

    const isOwner = await fakeCurrency.owners(otherAccount.address);
    expect(isOwner).to.equal(true);
  });
  it("should allow mint and transfer from an owner", async () => {
    const { fakeCurrency, owner, otherAccount } = await loadFixture(
      deployOneYearLockFixture
    );
    const initialSupply = await fakeCurrency.totalSupply();
    const initialBal = await fakeCurrency.balanceOf(otherAccount.address);
    await fakeCurrency.mintAndTransfer(1000, otherAccount.address);

    const newSupply = await fakeCurrency.totalSupply();
    const newBalance = await fakeCurrency.balanceOf(otherAccount.address);

    expect(newSupply).to.equal(initialSupply.add(1000));
    expect(newBalance).to.equal(initialBal.add(1000));
  });
});
