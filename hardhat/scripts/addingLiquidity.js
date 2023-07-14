// 0x00000000000000000000000087ad83dc2f12a14c85d20f178a918a65edfe1b4200000000000000000000000074f769cc664f8290dcfe69d15dfb0c4827ea406e000000000000000000000000000000000000000000000000000000006489bd6c0000000000000000000000000000000000000000000000000000000000000001


const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");


async function main() {
    
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
    const unsignedMetadata = "manual-payload";
const redstonePayload = await sdk.requestRedstonePayload(
    {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","META","GOOG"],
    },
    ["https://d33trozg86ya9x.cloudfront.net"],
    unsignedMetadata
  );
  const exchange = await hre.ethers.getContractAt("Exchange","0xFBe76B20997f18C191E02b81E0855Efa5A83d733",signer);
  const loanPool = await hre.ethers.getContractAt("LoanPool","0x93875aa3abAB98Ca1b57cD7aeCa38Bdb1384FF5A",signer);

  const exchangeViewer = await hre.ethers.getContractAt("ExchangeViewer","0xAe2a5e1fA5012982CCE291E5918e7Bf3Ff156d2a",signer);
const theseus = "0x5f96762CD2878c99177F03F3BC803fEA9EA6D421";
const TeslaAmm = "0x0AfB725e85F1f43DdFEeaF3195Adb800ed6ff2B0"
const MetaAmm = "0x361beB3582eE3617d18C42E456e7C3e3E7ccc64f";
    const teslaAmm = await hre.ethers.getContractAt("VAmm","0xB9bbeB3B30C89b34F1D06434164Fd27beDb565E4",signer);
  const ammViewer = await hre.ethers.getContractAt("AmmViewer","0xbC01aAd4C5256888B965C5Dab56a705708a439B7",signer);
  const teslaBytes = ethers.utils.formatBytes32String("TSLA");
//   const price = await ammViewer.getPriceValue(`0x${redstonePayload}`,teslaBytes);
//     console.log(ethers.utils.formatUnits(price,8));
    // const tx = await exchange.addLiquidityToPosition(tradeID,6,20000000,`0x${redstonePayload}`, {gasLimit: 1000000});
    // console.log(tx.hash);
    // console.log(tx);
    // console.log("Liquidity added");
    // const tx = await exchange.closeOutPosition(tradeID,`0x${redstonePayload}`, {gasLimit: 1000000})
    // exchange.positions(tradeID).then((res)=>{
    //     console.log(res);
    // });

     const moneyFormatter = (num) => {
      return (num/10**6).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
    // const availableThes = await exchange.availableBalance(theseus);
    // console.log(availableThes);
    const totalUsdc = await exchange.poolTotalUsdcSupply(MetaAmm);
    const available = await exchange.poolAvailableUsdc(MetaAmm);
    console.log('poolTotal: $',moneyFormatter(totalUsdc));
    console.log('poolAvailable" $',moneyFormatter(available));
    const tradingFee = await loanPool.tradingFeeLoanPool(MetaAmm);
    console.log('trading fee',tradingFee.toString());
    const maxTF = await loanPool.maxTradingFeeLimit();
    const minTf = await loanPool.minTradingFeeLimit();
    console.log('max tf',maxTF.toString());
    console.log('min tf',minTf.toString());
    const aviluserBal = await exchange.availableBalance("0xF7Ec143FAF2f6fB7198d8b0993B6620e9155b6e9");
    console.log('available balance',aviluserBal.toString());
    // const tradeId = '0x00000000000000000000000087ad83dc2f12a14d87s20f178a918a65edfe1b420000000000000000000000000ffae85a8f923e3d078598083b88c194442b65440000000000000000000000000000000000000000000000000000000064a883780000000000000000000000000000000000000000000000000000000000000001'
    // console.log(isActive);
    // const liquid = await exchangeViewer.checkLiquidiationList();
    // console.log('liquidation list',liquid);

    // const googAmm = await hre.ethers.getContractAt("VAmm","0x3951c8AF6Cbfd7e4Fb0C694b1CA366abE8F5c1AB",signer);
    // const tradeId ='0x00000000000000000000000087ad83dc2f12a14c85d20f178a918a65edfe1b420000000000000000000000003951c8af6cbfd7e4fb0c694b1ca366abe8f5c1ab0000000000000000000000000000000000000000000000000000000064ad7290ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    // const ffr = await exchangeViewer.calcFFR(tradeId,googAmm.address);
    // const initialTradeBalance = await exchange.tradeBalance(tradeId);
    // console.log('ffr',ffr);
    // const ffrFull = await exchangeViewer.calcFFRFull(tradeId,googAmm.address,initialTradeBalance);
    // console.log('ffrFull',ffrFull);
    // const interestOwed =await  loanPool.interestOwed(tradeId, googAmm.address)
    // console.log('interestOwed',interestOwed);
    // const tradeColl = await exchange.tradeCollateral(tradeId)
    // const posColl =   await  exchange.positions(tradeId);
    // console.log('tradeColl',tradeColl);
    // console.log('posColl',posColl);

    // const tx = await exchange.payInterestPayments(tradeId,googAmm.address,{gasLimit: 1000000});
    // const recipt = await tx.wait()
    // console.log(recipt);
    // console.log(tx.hash);
    // console.log(tx);
    // const allValues = await exchangeViewer.getAllValues(tradeId);
    // console.log('all values',allValues);
    // const interestOwed = await loanPool.interestOwed(tradeId,teslaAmm.address);
    // console.log('interestOwed',interestOwed);
    // const collateral = await exchange.tradeCollateral(tradeId);
    // console.log('collateral',collateral);
    // const isLiquidActive = await exchange.isActive(liquid[0]);
    // console.log(isLiquidActive);

    // const tx = await exchange.liquidate(liquid[0],`0x${redstonePayload}`,{gasLimit: 9000000});
    // // const isLiquidActive2 = await exchange.isActive(liquid[0]);
    // // console.log(isLiquidActive2);
    // console.log(tx.hash);
    // console.log(tx);

    // console.log('trades amt',isActive.length);
    // for(let i=0;i<isActive.length;i++){
    //    console.log('isActive',i,await exchange.isActive(isActive[i]));
    // }
    // const isFrozen = await teslaAmm.isFrozen();
    // console.log(isFrozen);

    // for(let i=0;i<isActive.length;i++){
    //     const getValues = await exchangeViewer.getValues(isActive[6]);
    //     console.log('values for ',6,':',getValues);
    //     const interestOwed = await loanPool.interestOwed(isActive[6],teslaAmm.address);
    //     console.log('interestOwed for ',6,':',interestOwed);
    //     const collateral = await exchange.tradeCollateral(isActive[6]);
    //     console.log('collateral for ',6,':',collateral);
    //     const position = await exchange.positions(isActive[6]);
    //     console.log('position size for ',6,':',position.positionSize.toString());
    //     const isActiveTarde = await exchange.isActive(isActive[6]);
    //     console.log('isActive for ',6,':',isActiveTarde);
    //     // 459765513-406225265=53540324
    //     console.log(isActive[6])
    // //  }
    // const decoded = await exchange.decodeTradeId(isActive[6]);
    // console.log(decoded);
    //add collateral
    // await exchange.addCollateral(isActive[6],111000000,{gasLimit: 1000000});
    // addLiquidityToPosition(bytes memory _tradeId,uint _leverage,uint _addedCollateral,bytes calldata _payload)
    // await exchange.addLiquidityToPosition(isActive[6],6,20000000,`0x${redstonePayload}`,{gasLimit: 1000000});

    // await exchange.removeLiquidityFromPosition(isActive[6],53540324,`0x${redstonePayload}`,{gasLimit: 1000000});
    //  await exchange.openPosition(teslaAmm.address,300000000,3,1,`0x${redstonePayload}`,{gasLimit: 1000000});
    // await exchange.closeOutPosition(isActive[6],`0x${redstonePayload}`,{gasLimit: 1000000});
    // '0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42',
    // collateral: BigNumber { value: "222000000" },
    // loanedAmount: BigNumber { value: "786000000" },
    // side: BigNumber { value: "1" },
    // positionSize: BigNumber { value: "355227432" },
    // entryPrice: BigNumber { value: "221266694" },
    // timeStamp: BigNumber { value: "1686748524" },
    // lastFundingRate: BigNumber { value: "2" },
    // amm: '0x74f769Cc664F8290DcfE69D15dFb0C4827Ea406e',
    // trader: '0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42'

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});