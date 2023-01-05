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

describe("UsdcController PoolUsdc", async () => {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount, vaultAdd] = await ethers.getSigners();
    const FakeCurrency = await ethers.getContractFactory("FakeErc20");
    const name = "Fake USDC";
    const decimals = 6;
    const symbol = "USDC";
    const fakeCurrency = await FakeCurrency.deploy(
      100000000000,
      name,
      symbol,
      decimals
    );
    const UsdcController = await ethers.getContractFactory("USDCController");
    const usdcAdd = fakeCurrency.address;
    const controller = await UsdcController.deploy(vaultAdd.address, usdcAdd);

    return { fakeCurrency, owner, otherAccount, controller, vaultAdd };
  }
  it("it should allow stake", async () => {
    const { fakeCurrency, owner, otherAccount, controller, vaultAdd } =
      await loadFixture(deployOneYearLockFixture);

    const initialBalance = await fakeCurrency.balanceOf(owner.address);
    const controllerusdcBefore = await controller.totalUSDCSupply();
    const controllerbalforFFK = await fakeCurrency.balanceOf(
      controller.address
    );

    const pkTokInitial = await controller.totalSupply();
    await fakeCurrency.approve(
      controller.address,
      ethers.utils.parseUnits("100", 6)
    );
    await controller.stakeUsdc(ethers.utils.parseUnits("100", 6));
    const postPTokBal = await controller.totalSupply();
    const controllerUSDCAvail = await controller.availableUSDC();

    const postBalance = await fakeCurrency.balanceOf(owner.address);
    const controllerUsdcTotalSupply = await controller.totalUSDCSupply();
    const controllerUsdc = await fakeCurrency.balanceOf(controller.address);

    // expect(postPTokBal).to.equal(pkTokInitial.add(100));
    // expect(initialBalance).to.equal(postBalance.add(100));
    expect(ethers.utils.formatUnits(controllerUSDCAvail, 6)).to.equal(
      ethers.utils.formatUnits(controllerUsdcTotalSupply, 6)
    );
    expect(ethers.utils.formatUnits(controllerUsdc, 6)).to.equal(
      ethers.utils.formatUnits(controllerUsdcTotalSupply, 6)
    );
  });
  it("it should allow adding usdc without stake updating totalusdcsupply and availbleSupply", async () => {
    const { fakeCurrency, owner, otherAccount, controller } = await loadFixture(
      deployOneYearLockFixture
    );

    await fakeCurrency.approve(controller.address, 500);
    await controller.stakeUsdc(100);
    const controllerUsdcTotalSupply = await controller.totalUSDCSupply();
    const controllerUSDCAvail = await controller.availableUSDC();
    await controller.receiveUSDC(400);
    const postControllerUsdcTotalSupply = await controller.totalUSDCSupply();
    const postControllerUSDCAvail = await controller.availableUSDC();
    const postControllerUsdc = await fakeCurrency.balanceOf(controller.address);

    expect(controllerUsdcTotalSupply).to.equal(
      postControllerUsdcTotalSupply.sub(400)
    );
    expect(controllerUSDCAvail).to.equal(postControllerUSDCAvail.sub(400));
    expect(postControllerUsdc).to.equal(500);
  });
  it("it should allow stake and withdraw", async () => {
    const { fakeCurrency, owner, otherAccount, controller } = await loadFixture(
      deployOneYearLockFixture
    );

    await fakeCurrency.approve(controller.address, 100);
    await controller.stakeUsdc(100);
    const pTokBal = await controller.totalSupply();

    await fakeCurrency.mintAndTransfer(500, otherAccount.address);
    await fakeCurrency.connect(otherAccount).approve(controller.address, 500);
    await controller.connect(otherAccount).receiveUSDC(500);

    const controllerUsdcTotalSupply = await controller.totalUSDCSupply();
    const controllerUSDCAvail = await controller.availableUSDC();

    const controllerUsdc = await fakeCurrency.balanceOf(controller.address);
    await controller.withdrawStake(100);

    const postControllerUsdc = await fakeCurrency.balanceOf(controller.address);

    const postControllerUsdcTotalSupply = await controller.totalUSDCSupply();
    const postControllerUSDCAvail = await controller.availableUSDC();
    const postPTokBal = await controller.totalSupply();

    expect(controllerUsdcTotalSupply).to.equal(
      postControllerUsdcTotalSupply.add(600)
    );

    expect(controllerUSDCAvail).to.equal(postControllerUSDCAvail.add(600));
    expect(controllerUSDCAvail).to.equal(postControllerUSDCAvail.add(600));
    expect(controllerUsdc).to.equal(postControllerUsdc.add(600));
    expect(pTokBal).to.equal(100);
    expect(postPTokBal).to.equal(0);
  });

  //test variable values make sure the math is right
  //test failures over token
  //aaaaa........
  it("should allow users to borrow the synthetic USDC asset", async () => {
    const { fakeCurrency, owner, otherAccount, controller, vaultAdd } =
      await loadFixture(deployOneYearLockFixture);
    // // Send some USDC to the user's wallet
    await fakeCurrency.mintAndTransfer(
      ethers.utils.parseUnits("100", 6),
      owner.address
    );
    // Approve the USDCController contract to spend the user's USDC
    await fakeCurrency.approve(
      controller.address,
      ethers.utils.parseUnits("100", 6)
    );
    await controller.stakeUsdc(ethers.utils.parseUnits("100", 6));
    // Call the borrow function
    const tradeId = ethers.utils.keccak256(
      otherAccount.address,
      "BTC",
      3887261
    );
    const tx = await controller.connect(vaultAdd).callStatic.borrow(
      ethers.utils.parseUnits("5", 6), // Initial margin
      3, // Leverage
      tradeId, // Trade ID
      otherAccount.address // Trader address
    );
    await controller.connect(vaultAdd).borrow(
      ethers.utils.parseUnits("5", 6), // Initial margin
      3, // Leverage
      tradeId, // Trade ID
      otherAccount.address // Trader address
    );
    // 1672505250
    // const intrest = await controller.callStatic.getOwedIntrest(
    //   tradeId,
    //   1672500050
    // );
    const userDebt = await controller.userDebt(otherAccount.address);

    // console.log("intrest owed i think", ethers.utils.formatUnits(intrest, 6));
    // console.log("trade debt", ethers.utils.formatUnits(userDebt, 6));

    // Check that the loan amount is correct
    expect(tx.loanAmountToVault).to.be.deep.equal(
      ethers.utils.parseUnits("10", 6)
    );
    // Check that the user's debt is correct
    expect(userDebt).to.be.deep.equal(ethers.utils.parseUnits("10", 6));
    // Check that the trade debt is correct
    expect(await controller.tradeDebt(tradeId)).to.be.deep.equal(
      ethers.utils.parseUnits("10", 6)
    );
    // Check that the available USDC has decreased
    expect(await controller.availableUSDC()).to.be.deep.equal(
      ethers.utils.parseUnits("90", 6)
    );
    // Check that the loaned USDC has increased
    expect(await controller.loanedUSDC()).to.be.deep.equal(
      ethers.utils.parseUnits("10", 6)
    );
  });
  it.skip("should allow pay interest", async () => {
    const { fakeCurrency, owner, otherAccount, controller, vaultAdd } =
      await loadFixture(deployOneYearLockFixture);
    // // Send some USDC to the user's wallet
    await fakeCurrency.mintAndTransfer(
      ethers.utils.parseUnits("100", 6),
      owner.address
    );
    await fakeCurrency.mintAndTransfer(
      ethers.utils.parseUnits("100", 6),
      vaultAdd.address
    );
    // Approve the USDCController contract to spend the user's USDC
    await fakeCurrency.approve(
      controller.address,
      ethers.utils.parseUnits("100", 6)
    );
    await controller.stakeUsdc(ethers.utils.parseUnits("100", 6));
    // Call the borrow function
    const tradeId = ethers.utils.keccak256(
      otherAccount.address,
      "BTC",
      3887261
    );
    const tx = await controller.connect(vaultAdd).callStatic.borrow(
      ethers.utils.parseUnits("5", 6), // Initial margin
      3, // Leverage
      tradeId, // Trade ID
      otherAccount.address // Trader address
    );
    await controller.connect(vaultAdd).borrow(
      ethers.utils.parseUnits("5", 6), // Initial margin
      3, // Leverage
      tradeId, // Trade ID
      otherAccount.address // Trader address
    );
    // 1672505250
    // const intrest = await controller.callStatic.getOwedIntrest(
    //   tradeId,
    //   1672500050
    // );
    const usdcSupply = await controller.totalUSDCSupply();
    const usdcAvail = await controller.availableUSDC();

    const fee = await controller.tradeMarginRequired(tradeId);
    const nextBlock = await controller.nextIntrestBlock(tradeId);

    await fakeCurrency.connect(vaultAdd).approve(controller.address, fee);
    // console.log("intrest owed i think", ethers.utils.formatUnits(intrest, 6));
    // console.log("trade debt", ethers.utils.formatUnits(userDebt, 6));

    const nextBlockPost = await controller.callStatic.payOwedIntrest(
      tradeId,
      owner.address
    );

    await controller.payOwedIntrest(tradeId, owner.address);

    // Check that nextblock for interest payment is gretaer than or equal to previous block interest payment by interestperiod
    expect(nextBlockPost).to.be.gte(
      nextBlock.add(await controller.intrestPeriod())
    );
    // Check the usdc supply = old supply plus fee just payed
    expect(usdcSupply.add(fee)).to.be.deep.equal(
      await controller.totalUSDCSupply()
    );

    expect(usdcAvail.add(fee)).to.be.deep.equal(
      await controller.availableUSDC()
    );
  });
});

describe("UsdcController repay,close trade, payInterest and combo", async () => {
  async function deployControllerFixture() {
    const [owner, otherAccount, vaultAdd] = await ethers.getSigners();
    const FakeCurrency = await ethers.getContractFactory("FakeErc20");
    const name = "Fake USDC";
    const decimals = 6;
    const symbol = "USDC";
    const fakeCurrency = await FakeCurrency.deploy(
      100000000000,
      name,
      symbol,
      decimals
    );
    const UsdcController = await ethers.getContractFactory("USDCController");
    const usdcAdd = fakeCurrency.address;
    const controller = await UsdcController.deploy(vaultAdd.address, usdcAdd);

    await fakeCurrency.mintAndTransfer(
      ethers.utils.parseUnits("100", 6),
      owner.address
    );
    await fakeCurrency.mintAndTransfer(
      ethers.utils.parseUnits("100", 6),
      vaultAdd.address
    );
    // Approve the USDCController contract to spend the user's USDC
    await fakeCurrency.approve(
      controller.address,
      ethers.utils.parseUnits("100", 6)
    );
    await fakeCurrency
      .connect(vaultAdd)
      .approve(controller.address, ethers.utils.parseUnits("1000", 6));
    await controller.stakeUsdc(ethers.utils.parseUnits("100", 6));
    // Call the borrow function
    const tradeId = ethers.utils.keccak256(
      otherAccount.address,
      "BTC",
      3887261
    );

    await controller.connect(vaultAdd).borrow(
      ethers.utils.parseUnits("5", 6), // Initial margin
      3, // Leverage
      tradeId, // Trade ID
      otherAccount.address // Trader address
    );

    return { fakeCurrency, owner, otherAccount, controller, vaultAdd, tradeId };
  }

  it("should allow repayment by half", async () => {
    const { fakeCurrency, owner, otherAccount, controller, vaultAdd, tradeId } =
      await loadFixture(deployControllerFixture);

    // get values to check
    const prevLoandedUSDC = await controller.loanedUSDC();
    const prevTradeDebt = await controller.tradeDebt(tradeId);
    const prevUsdcSupply = await controller.totalUSDCSupply();
    const prevAvailUSDCSupply = await controller.availableUSDC();
    const prevTradeMarginReq = await controller.tradeMarginRequired(tradeId);
    const prevtotalTradeValueAfterClose =
      await controller.totalTradeValueAfterClose(tradeId);
    const valueToSend = parseUnits("5", 6);
    //repay half loaned which is 5 fee should be 0.05 when formatted
    await controller
      .connect(vaultAdd)
      .repayLoan(tradeId, valueToSend, otherAccount.address);
    //get post values from above
    const postLoandedUSDC = await controller.loanedUSDC();
    const postTradeDebt = await controller.tradeDebt(tradeId);
    const postUsdcSupply = await controller.totalUSDCSupply();
    const postAvailUSDCSupply = await controller.availableUSDC();
    const postTradeMarginReq = await controller.tradeMarginRequired(tradeId);
    const posttotalTradeValueAfterClose =
      await controller.totalTradeValueAfterClose(tradeId);

    // check total trade valeafterclose should include fee
    expect(prevLoandedUSDC).to.be.eq(postLoandedUSDC.add(valueToSend));

    //trade debt should = new trade debt adding in loan repayed
    expect(prevTradeDebt).to.be.eq(postTradeDebt.add(valueToSend));
    expect(prevUsdcSupply).to.be.eq(postUsdcSupply.sub(valueToSend / 100));
    expect(prevAvailUSDCSupply).to.be.eq(
      postAvailUSDCSupply.sub(valueToSend).sub(valueToSend / 100)
    );
    expect(prevtotalTradeValueAfterClose).to.be.eq(
      posttotalTradeValueAfterClose.sub(valueToSend / 100)
    );
    expect(prevTradeMarginReq).to.be.eq(
      postTradeMarginReq.add(valueToSend / 100)
    );
    //trade margin shoul be same as fee now
    //
  });
  it.skip("Should allow close trade and update appropriate state variables and mappings", async () => {
    const { fakeCurrency, owner, otherAccount, controller, vaultAdd, tradeId } =
      await loadFixture(deployControllerFixture);

    const prevTradeMarginReq = await controller.tradeMarginRequired(tradeId);
    const prevAvailUSDCSupply = await controller.availableUSDC();
    const prevTradeDebt = await controller.tradeDebt(tradeId);
    const prevUsdcSupply = await controller.totalUSDCSupply();
    const prevtotalTradeValueAfterClose =
      await controller.totalTradeValueAfterClose(tradeId);

    await controller.connect(vaultAdd).closeDebt(otherAccount.address, tradeId);
    const postLoandedUSDC = await controller.loanedUSDC();
    const postTradeDebt = await controller.tradeDebt(tradeId);
    const postUsdcSupply = await controller.totalUSDCSupply();
    const postAvailUSDCSupply = await controller.availableUSDC();
    const posttotalTradeValueAfterClose =
      await controller.totalTradeValueAfterClose(tradeId);

    const postTradeMarginReq = await controller.tradeMarginRequired(tradeId);

    expect(postLoandedUSDC).to.be.equal(0);
    expect(postTradeDebt).to.be.equal(0);
    expect(postAvailUSDCSupply).to.be.equal(
      prevAvailUSDCSupply.add(prevTradeDebt).add(prevTradeMarginReq)
    );
    expect(postUsdcSupply).to.be.eq(prevUsdcSupply.add(prevTradeMarginReq));
    expect(prevtotalTradeValueAfterClose).to.be.equal(
      posttotalTradeValueAfterClose.sub(prevTradeMarginReq)
    );
    expect(postTradeMarginReq).to.be.eq(0);
  });
});
