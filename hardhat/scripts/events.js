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


    const exchange = await hre.ethers.getContractAt("Exchange","0x909ABE9609cC77286f5201d6CfFB91aCefC86903",signer);
    const loanPool = await hre.ethers.getContractAt("LoanPool","0xd13427B7aa8Ef6f3B009F07D3c6762a3354B3C68",signer);
    const teslaAmmAdd = "0xd03605192d07Be814B409293beE01B0abE0B1685";
    const staking = await hre.ethers.getContractAt("Staking","0x07d1495D080f2C986C9e87C916326eFd2E6c6015",signer);

    const exView = await hre.ethers.getContractAt("ExchangeViewer","0x8E63036a15314045b2C66f4Ef694421643a66764",signer);
    const metaAmm = await hre.ethers.getContractAt("VAmm","0xB77B90B93be5b2964dEf0faC6F5C372d95AB3776",signer);

    // event ClosePosition(
    //     address indexed trader,
    //     uint timestamp,
    //     uint closePrice,
    //     uint closeTime,
    //     int pnl
    // );
    const filter = exchange.filters.ClosePosition(null,null,null,null,null)
    await exchange.queryFilter(filter,9122471, 'latest').then((events) => {
            events.forEach((event) => {
                event.getBlock().then((receipt) => {
                    const {trader,timestamp,closePrice,closeTime,pnl} = event.args;
                    console.log('closing price', closePrice);
                }
                )})})
    // const pnl = await exView.getPnl('0x00000000000000000000000087ad83dc2f12a14c85d20f178a918a65edfe1b42000000000000000000000000d03605192d07be814b409293bee01b0abe0b16850000000000000000000000000000000000000000000000000000000064947f180000000000000000000000000000000000000000000000000000000000000001');
    // console.log('pnl',pnl);
    // const snapshots = await metaAmm.getLastSnapshot();
    // console.log('snapshots',snapshots);
    // const AmmViewer = await hre.ethers.getContractAt("AmmViewer","0xE1c16CA78CAfD20044238D8A08Cd983249870221",signer);
    // const filter = AmmViewer.filters.PriceChange(null, null,null,null,null,null)
    // await AmmViewer.queryFilter(filter, 9122471, 'latest').then((events) => {
    //     events.forEach((event) => {
    //         event.getBlock().then((receipt) => {
    //             const {  amm, currentIndex, indexPrice, baseAsset, quoteAsset, ffr} = event.args;
    //             if(amm == metaAmm.address){

    //               console.log('timestamp',receipt.timestamp)
    //               console.log(`timestamp over ther to data ${new Date(receipt.timestamp*1000).toLocaleTimeString()}`);
    //               console.log(`PriceChange event emitted with amm ${amm} and currentIndex ${currentIndex} indexPrice ${indexPrice} ffr ${ffr}:`);
    //               // console.log(event);
    //             }
    //         });
    //     });
    // });
    // const assetPrice = await metaAmm.getAssetPrice();
    // console.log('assetPrice $',assetPrice/10**6);
    // const filter = exchange.filters.NewPosition( null,'0xB77B90B93be5b2964dEf0faC6F5C372d95AB3776', null,null);
//     const stakingArr = [];
//$ 285.635656 old asset price
//assetPrice $ 286.384969
// const stakingFilter = staking.filters.Stake(null, null, null,null,null);
// await  staking.queryFilter(stakingFilter, 9122471, 'latest').then((events) => {
//     events.forEach((event) => {
//         event.getBlock().then((receipt) => {
//             const {  user, usdcAmount,  tokenId, ammPool, tokensMinted} = event.args;
//             console.log(`Stake event emitted with user ${user} and usdc ${usdcAmount} token Id ${tokenId}:`);
//             // console.log(event);
//             console.log('----------------------');
//           console.log('Transaction receipt:');
//           console.log(receipt.timestamp);
//           stakingArr.push({staker:user, staked:usdcAmount, date:receipt.timestamp,ammPool:ammPool});

//         });
//       });
      
//     });
//     console.log('staking arr',stakingArr);
    // loanPool.
    // Get past events for the NewPosition event
    // exchange.queryFilter(filter, 9122471, 'latest')
    //   .then((events) => {
    //     events.forEach((event) => {
    //         event.getBlock().then((receipt) => {
    //             const { trader,amm,side,timeStamp } = event.args;
    //             console.log(`NewPosition event emitted with trader ${trader} on AMM ${amm} with side ${side} at ${timeStamp}:`);
    //             // console.log(event);
    //             console.log('----------------------');
    //           console.log('Transaction receipt:');
    //           console.log(receipt.number);
    //         });
    //     });
    //   });

      //getAllliquidations
      // const filter2 = exchange.filters.Liquidated(null);
      // exchange.queryFilter(filter2, 9122471, 'latest').then((events) => {
      //   events.forEach((event) => {
      //       event.getBlock().then((receipt) => {
      //           const { tradeId} = event.args;
      //           console.log(`Liquidation event emitted with trade ID ${tradeId.hash} by trader `);
      //           console.log(event);
      //           console.log('----------------------');
      //         console.log('Transaction receipt:');
      //         console.log(receipt.timestamp);
      //       });
      //   });
      // });

}
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });