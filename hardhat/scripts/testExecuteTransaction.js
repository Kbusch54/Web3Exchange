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
   
    // const ariadne = await hre.ethers.getContractAt("TheseusDAO","0xA547af463d3A202e0E85CA766FB67eE0395e4D5C",signer);
    // const staking = await hre.ethers.getContractAt("Staking","0x0C9dfCBe62a84344fE53B2B39f9dc9906bbdEFC4",signer);

    // // const usdc = await hre.ethers.getContractAt("FakeUsdc","0xAADbde5D0ED979b0a88770be054017fC40Bc43d1",signer);

    // const toStake = ethers.utils.parseUnits("100", 6);
    // await staking.stake(toStake,ariadne.address);


    // const signatures = [ "0x41f3ed6178ea12fde9effb8c9b48aa04963e20814810a6ccbf9649fce8760c8074765afd5f729cde9d3445ab5f88ccbab11f6ad5d3f4fa7b0a9f0b16720f0b5b1c"];
    // const value='0x0';
    // const data ="0xf6890b310000000000000000000000000000000000000000000000000000000000003840";
    // const nonce = 0;
    // // const transactionHash = await ariadne.getTransactionHash(nonce, ariadne.address, value, data);
    // // const trh ='0xa738f8522e6a2e90198d1778182a4d31ae7f1bd3131898c4c5c1cf248d2c5c3d'
    // // console.log(transactionHash);
    // const tx = await ariadne.newProposal( ariadne.address,data);

    const exchange = await hre.ethers.getContractAt("Exchange","0x909ABE9609cC77286f5201d6CfFB91aCefC86903",signer);
    const loanPool = await hre.ethers.getContractAt("LoanPool","0xd13427B7aa8Ef6f3B009F07D3c6762a3354B3C68",signer);

    // const teslaAmm ='0xd4e3F66E134558Df57cD7Ce2e17758Bf9e041851'

    // const minLoan = await loanPool.minLoan(teslaAmm);
    // console.log('minLoan $',ethers.utils.formatUnits(minLoan, 6));
    // const maxLoan = await loanPool.maxLoan(teslaAmm);
    // console.log('maxLoan $',ethers.utils.formatUnits(maxLoan, 6));
    // const mmr = await loanPool.mmr(teslaAmm);
    // console.log('mmr $',ethers.utils.formatUnits(mmr, 6));
    // const tradeCollateral = ethers.utils.parseUnits("75", 6);
    // const leverage = 3;
    // const side =1;
   
    // // const gasLimit = ethers.utils.parseUnits("500", wei);

    // const loanAmt = tradeCollateral*leverage;

    // // const Vamm = await hre.ethers.getContractAt("VAmm",teslaAmm,signer);
    // const ammViewer = "0xa17C2eF962C1270950E07A15bf7C3E48aB4B6D72"

    // const viewer = await hre.ethers.getContractAt("AmmViewer",ammViewer,signer);

    // const isFrozen = await Vamm.isFrozen();
    // console.log('isFrozen: ', isFrozen);

    const inputTSLA = formatBytes32String("TSLA");
    console.log('inputTSLA: ', inputTSLA);
    // const teslaPrice = await viewer.getPriceValue(inputTSLA);
    // console.log('teslaPrice: ', teslaPrice.toString());

    // //amm viewer
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
  

  // console.log('redstonePayload: ', redstonePayload);
//   const payloadFromAmm = await viewer.payload();
//   const redStoneP = `0x${redstonePayload}`
//   // console.log('payloadFromAmm: ', payloadFromAmm);
// const oldPayload = '0x54534c4100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042f4637400188407af52000000020000001142d0fa5bb5bcae9ccdd8315de95ca5cd0c02adb1869345e4f49d6b0b12af67f0f77e166d0262f455cc2fe4348cb57850515ef2d28997b0eb999824f5827eec81b4d4554410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b5d56e600188407af52000000020000001e1d084a7b9e104fc3c42a5bca663ddd3a3317ca9db055372ece7c6793302733c6b81dc74e78f17e359f4998ea5452bc8b8d986b869f2d8fb502d7408487274fa1b474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002debf17c00188407af520000000200000012c27e170601ce776be3a287512765ffecec60fac641ee38ffd906a4ac8f76c764591d24349ba30ef9b2330c4a513c53b5334ba420867f1d4e435c25ad90ba3321b00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
//   // console.log('do the equal', payloadFromAmm== redStoneP);
//   // console.log('do the equal old to new', payloadFromAmm== oldPayload);
//   // console.log('payloadAMm', payloadFromAmm);
//   // console.log('redStoneP', redStoneP);
//   // console.log('oldPayload', oldPayload);
  const useThisNow = '0x54534c410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004fb6b918001888287d5000000002000000133ebab7a141e9ef89d4594c5f4a0523939f29958028ee16707f5f4351099aea2752636884c340a72d26eeecef378fd8c9ea9de1a2880986c070b8c7baa9745ac1c4d455441000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000658e1d94001888287d500000000200000017ed71dc63850e67d59042791650a7c5743307ce0c30705e38ae4ff1615584c952409e355748ae1128d27b93935d3f0ba62d23abcfdedd382472f3295279fec6d1b474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ea40311001888287d5000000002000000120d912de9a636f93e228e823056b55c3a688742d2f92a1497a8fe7a6227de7477308fd7c1f80a578727ecd977c176044630dcd844914328a3d0aeb99b0f9fc651b00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
//   const useThis = '0x54534c410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004f7c8c840018882382e6000000020000001f7e2629b1f9d59e0a6089865d80a5a1584fd28e36be675adacdb1c0b5f1d5c082bf55fe8cd11251b3f3bb509650e0a2080c735365bb8fea14ca42a3e6d5adbbc1c4d4554410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006580498a0018882382e60000000200000010daf5aa8370f8fd1b717e960c6c9c2f9a75363d0bdc496897238bcb95e4f7c1922081a4f713dd911eb2cf86201464c31818979de1ecf0642cad2632d31bd1c3a1c474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ea403110018882382e60000000200000015d3bc99a79b79e79d16f535794279059fff398521ec860aaf77332e9537092a13949f92423d441335ccb38f61c67ab7195dd2fe2e4875d830733ab232a8cecde1c00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
  // const latestPrice = await payload.getLatestPrice(useThisNow,inputTSLA);
  // console.log('latestPrice: $', ethers.utils.formatUnits(latestPrice, 8));


  // const VAmm = await hre.ethers.getContractFactory('VAmm');
// const teslaAmm = await VAmm.deploy(ammViewer);
// await teslaAmm.deployed();
// const teslaPriced = ethers.utils.parseUnits("300", 6);
// const teslaBytes = ethers.utils.formatBytes32String("TSLA");
// const uniQuoteAsset = ethers.utils.parseUnits("400", 6);
// const indexPricePeriod = time.duration.hours(4);
// const thisIsInit = await teslaAmm.init(teslaBytes,322000000,uniQuoteAsset,indexPricePeriod,signer.address);
// const teslaAmm = await hre.ethers.getContractAt("VAmm","0xBD9652a899E149D5Ed584D42b79F2730b878c68d",signer);
// console.log('teslaAmm: ', teslaAmm.address);
// console.log('thisIsInit: ', thisIsInit);
// const oldpRICE = await teslaAmm.getLastAssetSpotPrice();


const outstandingLoan = await exchange.poolOutstandingLoans("0xB77B90B93be5b2964dEf0faC6F5C372d95AB3776")

console.log('outstandingLoan: ', outstandingLoan.toString());
const tradIds = await exchange.getTradeIds(signer.address);
console.log('tradIds: ', tradIds[1]);

const exView =  await hre.ethers.getContractAt("ExchangeViewer","0x8E63036a15314045b2C66f4Ef694421643a66764",signer);
// const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
// const exView = await ExchangeViewer.deploy(loanPool.address, "0x48EBEBD2A4264274D303e5EB1581Ab31989F1653", "0x8EdC8f028eaE0ACb8276d517D54e2680d57EA697",exchange.address,"0x8FdB0BacA21b8b1617B6A5b720517E0701c338a1");
// await exView.deployed();
console.log('exView: ', exView.address);
const position = await exchange.positions(tradIds[1]);
console.log('position: timestamp', position[5],'trader',position[8]);
const trader = await position[8];
const timestamp = await  position[5];
const newID = trader.toString().concat('_').concat(timestamp.toString());
console.log('newID: ', newID);
// const teslaAMM ='0x74f769Cc664F8290DcfE69D15dFb0C4827Ea406e'
// const tradeCollFor1 = await exchange.tradeCollateral(tradIds[0]);
// console.log('tradeCollFor1: ', tradeCollFor1.toString());
// const tradeCollFor2 = await exchange.tradeCollateral(tradIds[1]);
// console.log('tradeCollFor2: ', tradeCollFor2.toString());
// //pay interest payments for both trades
// const interestOwed = await loanPool.interestOwed(tradIds[0], teslaAMM);
// console.log('interestOwed: ', interestOwed.toString());
// console.log('tradIds[0]: ', tradIds[0]);
const availableBalance = await exchange.availableBalance(signer.address);
console.log('availableBalance: ', availableBalance.toString());
// const tradeCollateral = await exchange.tradeCollateral(signer.address);

const liquidationList = await exView.checkLiquidiationList();
console.log('liquidationList: ', liquidationList.map((x)=>x.toString()));
const isTardeActive = await exchange.isActive(tradIds[1]);
console.log('isTardeActive: ', isTardeActive);
const checkLiquidtonm =await  exView.checkLiquidiation(tradIds[1]);
console.log('checkLiquidtonm: ', checkLiquidtonm);
// const liq = await exchange.liquidate(tradIds[1],`0x${redstonePayload}`,{gasLimit:400000});
// console.log('liq: ', liq);
const checkLiquidtonm2 =await  exView.checkLiquidiation(tradIds[1]);
console.log('checkLiquidtonm after : ', checkLiquidtonm2);
// const startBlock = 9122465
// let eventFilters = exchange.filters.AddCollateral();
// // await exchange.on('AddCollateral', (tradeId, amount) => {
// //   console.log('AddCollateral', tradeId, amount);
// // })
// let events = await exchange.queryFilter(eventFilters, startBlock);

// console.log('tradId all set',events);
// const isTradeActive = await exchange.isActive(tradIds[0]);
// console.log('isTradeActive: ', isTradeActive);

// // console.log('closeTrade: ', await exchange.closeOutPosition(tradIds[0],`0x${redstonePayload}`));

// const isTradeActiveAfter = await exchange.isActive(tradIds[0]);
// console.log('isTradeActiveAfter: ', isTradeActiveAfter);
// const collToAdd = ethers.utils.parseUnits("100", 6);
// const addColl = await exchange.addCollateral(tradIds[0],collToAdd);
// console.log('addColl: ', addColl);

// const availableBalance2 = await exchange.availableBalance(signer.address);
// console.log('availableBalance after : ', availableBalance2.toString());

// const amm = await exchange.decodeTradeId(tradIds[0]);
// console.log('amm: ', amm);
// const payInterest = await exchange.payInterestPayments(tradIds[0],teslaAMM);

// const payInterest2 = await exchange.payInterestPayments(tradIds[1],teslaAMM);
// const position = await exView.calcFFRFull(tradIds[1],teslaAMM,50000000);
// console.log('position: ', position.toString());
// const openPosition = await teslaAmm.openPosition(loanAmt, side,`0x${redstonePayload}`,{gasLimit:400000});
// console.log('openPosition: ', openPosition);
// const newpRICE = await teslaAmm.getLastAssetSpotPrice();
// console.log('oldpRICE: ', oldpRICE);
// console.log('newpRICE: ', newpRICE);
// const liqsnap = await teslaAmm.getLiquidityChangedSnapshots();

// console.log('liqsnap: ', liqsnap);

//   const viewerPrice = await viewer.getPriceValue(`0x${redstonePayload}`,inputTSLA);
//   console.log('viewerPrice: $', ethers.utils.formatUnits(viewerPrice, 8));
    // getPriceValue

    // const isItAmm = await exchange.availableBalance(signer.address)

    // console.log('availbable abl $',ethers.utils.formatUnits(isItAmm, 6));
  //   try {
  //     const tx = await exchange.openPosition(teslaAmm, tradeCollateral, leverage, side,`0x${redstonePayload}`,{gasLimit:400000});
  //     await tx.wait();
  //     console.log('tx: ', tx);
  // } catch (error) {
  //   console.log('error: ', error)
  //     const reasonBytes = error.data;
  //     console.log("Error data:", reasonBytes);
  //     console.log("Error data (decoded):", reasonBytes);
  //     // const errorSelector = ethers.utils.hexDataSlice(reasonBytes, 0, 4);
  //     // console.log("Error selector:", errorSelector);
  // }
    // const proposal = await ariadne.proposals(12);
    // console.log(proposal);
    //0x5101794ff028174a8f785366afeb94b802e900ccf6b2644b612685755196aef4
    //0xc7fcd43cf688d1588deb80c304be562c36039c511b307cf3c6cff528f82d432d
    // uint _id,
    // address payable to,
    // uint256 value,
    // bytes calldata data,
    // bytes[] calldata signatures
    // const customGasLimit = 500000;// Use your existing provider
    // const tx = await ariadne.executeTransaction(nonce, ariadne.address, value, data, signatures,{gasLimit:customGasLimit});
    // console.log(tx);

    // const newVotingTime = await ariadne.votingTime();
    // console.log(newVotingTime.toString());
    // const signature = signer.signMessage(ethers.utils.arrayify(trh));
    // console.log(signature);

    // const tx = {
    //     to: ariadne.address,
    //     data: ariadne.interface.encodeFunctionData('executeTransaction', [nonce, ariadne.address, value, data, signatures]),
    //     gasLimit: customGasLimit,
    //   };
      
    //   const txHash = await alchemyProvider.sendTransaction(tx);
    //   const receipt = await alchemyProvider.getTransaction(txHash);
    //   const code = await alchemyProvider.call(receipt);
    //   console.log('Transaction code:', code);
      
    //   const reason = ethers.utils.toUtf8String('0x' + code.substr(138));
    //   console.log('Revert reason:', reason);

      
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});