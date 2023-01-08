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

describe("UsdcController Open and close positions", async () => {
  async function deployVaultFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const USDC = await ethers.getContractFactory("FakeErc20");
    const name = "Fake USDC";
    const decimals = 6;
    const symbol = "USDC";
    const usdc = await USDC.deploy(
      parseUnits("30000", 6),
      name,
      symbol,
      decimals
    );
    const UsdcController = await ethers.getContractFactory("USDCController");
    const usdcAdd = usdc.address;

    const btcAdd = "0x0facf6788EBAa4E7481BCcaFB469CD0DdA089ab3";
    const Vault = await ethers.getContractFactory("VaultForUsers");
    const vault = await Vault.deploy(5);
    const controller = await UsdcController.deploy(vault.address, usdcAdd);
    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy();
    await vault.updateUSDCAdd(usdcAdd);
    await vault.updateMarketAdd(market.address);
    await vault.updateControllerAdd(controller.address);

    await usdc.approve(vault.address, parseUnits("200", 6));
    await usdc.approve(controller.address, parseUnits("2000", 6));

    await controller.stakeUsdc(ethers.utils.parseUnits("1000", 6));
    await vault.depositUSDCToTreasurey(parseUnits("50", 6));
    await vault.deposit(parseUnits("100", 6));

    return { usdc, owner, otherAccount, controller, vault, market, btcAdd };
  }
  it.skip("allow open position adjust varibales accordingly", async () => {
    const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =
      await loadFixture(deployVaultFixture);
    // console.log(
    //   "amt in treasurey pre open",
    //   formatUnits(await vault.usdcInTreasury(), 6)
    // );
    await vault.changeMMR(300);
    const iMargin = parseUnits("10", 6);
    const lev = 15;
    const side = 1;
    // const curr = ethers.utils.arrayify(123475637);
    const tradeId = await vault.callStatic.openPositionWithLev(
      iMargin,
      lev,
      side,
      btcAdd
    );
    await vault.openPositionWithLev(iMargin, lev, side, btcAdd);
    console.log("trade id: ", tradeId);

    console.log(
      "amt in treasurey post open",
      formatUnits(await vault.usdcInTreasury(), 6)
    );
    const position = await vault.positions(0);

    console.log(position);
    console.log(
      "liquidation price:",
      formatUnits(position.liquidationPrice, 6)
    );
    console.log("position size:", formatUnits(position.positionSize, 6));
    console.log(
      "liq price:",
      position.liquidationPrice,
      "current price:",
      await market.btcPrice()
    );
    await vault.addLiquidity(parseUnits("2", 6), tradeId);
    const positionPost = await vault.positions(0);

    console.log("post add liqu", positionPost);
    console.log(
      "pre added liquidity",
      formatUnits(position.liquidationPrice, 6),
      "Pre total added liquidity:",
      formatUnits(position.addedLiquidity, 6),
      "margin",
      formatUnits(position.margin, 6),
      `\n`,
      "post added liquidity liquidation price :",
      formatUnits(positionPost.liquidationPrice, 6),
      "Post total added liquidity:",
      formatUnits(positionPost.addedLiquidity, 6),
      "margin",
      formatUnits(positionPost.margin, 6)
    );
    console.log("max lev", await vault.MAX_LEV());
  });
  // #todo: add test for iterating through mutliple changingMMR and checkin maxLev() doesnt exceed limits
  it.skip("changing mmr and chekcing max leverage doesnt exceed limits", async () => {
    const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =
      await loadFixture(deployVaultFixture);

    await vault.changeMMR(500);
    expect(await vault.MAX_LEV()).to.be.equal(15);

    await vault.changeMMR(300);
    expect(await vault.MAX_LEV()).to.be.equal(25);

    await vault.changeMMR(100);
    expect(await vault.MAX_LEV()).to.be.equal(50);
    //test for changing mmr and checking max leverage doesnt exceed limits 



    // mmrArr.forEach(async (mmr, i) => {
    //   await vault.changeMMR(mmr);
    //   const maxLev = await vault.MAX_LEV();

    //   const iMargin = parseUnits("10", 6);
    //   const long = 1;

    //   await vault.openPositionWithLev(iMargin, maxLev, long, btcAdd);

    //   const longPosition = await vault.positions(0);

    //   const short = -1;

    //   //   await vault.openPositionWithLev(iMargin, maxLev, short, btcAdd);
    //   //   const shortPosition = await vault.positions(1);
    //   console.log("check 5");
    //   console.log("mmmr", mmr);
    //   console.log(`Attempt #  ${i}`);
    //   console.log(
    //     "LongPosition Liq:",
    //     formatUnits(longPosition.liquidationPrice, 6),
    //     "price",
    //     formatUnits(longPosition.entryPrice, 6),
    //     "margin",
    //     formatUnits(longPosition.margin, 6),
    //     "loan",
    //     formatUnits(longPosition.outstandingLoan, 6)
    //   );

    //   // "ShortPosition Liq:",
    //   // await shortPosition.liquidationPrice

    //   expect(longPosition.liquidationPrice).to.be.lt(longPosition.entryPrice);
    //   //   expect(shortPosition.liquidationPrice).to.be.gt(shortPosition.entryPrice);
    // });
  });
  it.skip("changing mmr and chekcing max leverage doesnt exceed limits", async () => {
    const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =
      await loadFixture(deployVaultFixture);

    await vault.changeMMR(500);
    const maxLev = await vault.MAX_LEV();

    const iMargin = parseUnits("10", 6);
    const long = 1;
    const short = -1;

    await vault.openPositionWithLev(iMargin, maxLev, short, btcAdd);
    1;

     await vault.openPositionWithLev(iMargin, maxLev, long, btcAdd);
        const longPosition = await vault.positions(1);
 
  
    const tradeId1 = await vault.traderToIds(owner.address, 0);
    const tradeId2 = await vault.traderToIds(owner.address, 1);
    console.log("tradeIds:", tradeId1, tradeId2);
  

    const shortPosition = await vault.positions(0);
    console.log("short liq", await shortPosition.liquidationPrice);
    console.log("long liq", await longPosition.liquidationPrice);
    expect(longPosition.liquidationPrice).to.be.lt(longPosition.entryPrice);
    expect(shortPosition.liquidationPrice).to.be.gt(shortPosition.entryPrice);
  });
  it.skip("Checking tradeIds match to user and callable", async () => {
  const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =
      await loadFixture(deployVaultFixture);

    await vault.changeMMR(500);
    const maxLev = await vault.MAX_LEV();

    const iMargin = parseUnits("10", 6);
    const long = 1;
    const short = -1;

  
    const tx = await vault.openPositionWithLev(iMargin, maxLev, short, btcAdd);
   
    await vault.openPositionWithLev(iMargin, maxLev, long, btcAdd);
    const longPosition = await vault.positions(1);

   const tradeId1 = await vault.traderToIds(owner.address, 0);

    const tradeId2 = await vault.traderToIds(owner.address, 1);
   const allTrades =  await vault.callStatic.getAllUserTrades(owner.address);
expect(tradeId1).to.be.equal(allTrades[0]);
expect(tradeId2).to.be.equal(allTrades[1]);

  });
  it.skip("Adding liquidity checking if liquidity price reflects", async () => {
    const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =await loadFixture(deployVaultFixture);
    await vault.openPositionWithLev(parseUnits("10", 6), 15, 1, btcAdd);
    await vault.openPositionWithLev(parseUnits("10", 6), 15, -1, btcAdd);

    const alltrades = await vault.getAllUserTrades(owner.address);
    const position = await vault.positions(0);
    const position2 = await vault.positions(1);
 
    await vault.addLiquidity(parseUnits("2", 6),alltrades[0] );
    await vault.addLiquidity(parseUnits("2", 6),alltrades[1] );

    const postPosition = await vault.positions(0);
    console.log('before adding liquidity long',position.liquidationPrice);
    console.log('after adding liquidity long',postPosition.liquidationPrice);

    const postPosition2 = await vault.positions(1);

    expect(postPosition.liquidationPrice).to.be.gt(position.liquidationPrice);
    expect(postPosition2.liquidationPrice).to.be.lt(position2.liquidationPrice);
  });
  it("Closing position check", async () => {
    const { usdc, owner, otherAccount, controller, vault, market, btcAdd } =await loadFixture(deployVaultFixture);
    const collateral = parseUnits("10", 6);
    await vault.openPositionWithLev(collateral, 15, 1, btcAdd);
    const duringBalance = await vault.vaultBalances(owner.address);
    const tradeId = await vault.traderToIds(owner.address, 0);
    await market.changeBtcPrice(parseUnits("8", 6));
    const returnValue = await vault.callStatic.closePosition(tradeId); 
    await vault.closePosition(tradeId);
    const postBalance = await vault.vaultBalances(owner.address);
    expect(postBalance).to.be.equal(collateral.add(returnValue).add(duringBalance))
  });
});

