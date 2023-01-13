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
  async function deployAmmFixture() {
    const [owner, otherAccount,bot] = await ethers.getSigners();
 
    const VAMM = await ethers.getContractFactory("VAmm");
    const vamm = await VAMM.deploy();

    const path = "events/json/appl";
    // const assetAddress = "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3";
    const indexPrice = parseUnits("370", 6);
    const quoteAsset = parseUnits("5", 4);
    const indexPricePeriod = 2;

    await vamm.init( otherAccount.address,path, indexPrice, quoteAsset, indexPricePeriod);


    return {  owner,bot, otherAccount, vamm };
  }
    it("allow open position adjust varibales accordingly", async () => {
        const {owner,bot, vamm,otherAccount} = await loadFixture(deployAmmFixture);
    
    const snapShot = await vamm.liquidityChangedSnapshots(0);
    const mxP3 = Math.round(snapShot.baseAssetReserve/snapShot.quoteAssetReserve);
    console.log('Market price',formatUnits(mxP3,6));
    console.log('funding rate',formatUnits(snapShot.fundingRate,6));
    const openPosStatic = await vamm.callStatic.openPosition(parseUnits("200000",6),1);
    await vamm.openPosition(parseUnits("200000",6),1);
        console.log('Avg Entry Price:',formatUnits(openPosStatic.avgEntryPrice,6));
        console.log('psz:', formatUnits(openPosStatic.positionSize,6));


    const snapShot2 = await vamm.liquidityChangedSnapshots(0);
    const mxP = Math.round(snapShot2.baseAssetReserve/snapShot2.quoteAssetReserve);
    console.log('Market price',formatUnits(mxP,6));
    console.log('funding rate',formatUnits(snapShot2.fundingRate,6));



    const openPosStatic2 = await vamm.callStatic.openPosition(parseUnits("500000",6),-1);
    await vamm.openPosition(parseUnits("500000",6),-1);
    const snapShot3 = await vamm.liquidityChangedSnapshots(0);
    console.log('Avg Entry Price:',formatUnits(openPosStatic2.avgEntryPrice,6));
    console.log('psz:', formatUnits(openPosStatic2.positionSize,6));
    const mxP2 = Math.round(snapShot3.baseAssetReserve/snapShot3.quoteAssetReserve);
    console.log('Market price',formatUnits(mxP2,6));
    console.log('funding rate',formatUnits(snapShot3.fundingRate,6));
    const close = await vamm.callStatic.closePosition(openPosStatic.positionSize,1);
    console.log('close amt',formatUnits(close.usdcAmt,6));
    console.log('close avg Exit Price:',formatUnits(close.exitPrice,6));
    await vamm.closePosition(openPosStatic.positionSize,1)
        const opAmount = parseUnits("200000",6);
        const returnAmt = close.usdcAmt;
        console.log('pnl',formatUnits(returnAmt-opAmount,6));

    const snapShot4 = await vamm.liquidityChangedSnapshots(0);
    const mxP4 = Math.round(snapShot4.baseAssetReserve/snapShot4.quoteAssetReserve);
    console.log('Market price',formatUnits(mxP4,6));
    console.log('funding rate',formatUnits(snapShot4.fundingRate,6));
    console.log('position size 4',snapShot4.totalPositionSize);


    

    await vamm.adjustFundingPaymentsAll();
    const snapShot5 = await vamm.liquidityChangedSnapshots(1);
    console.log('position size 5',snapShot5.totalPositionSize);
    console.log('funding rate',formatUnits(snapShot5.fundingRate,6));
    });
}); 
