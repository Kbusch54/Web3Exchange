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


    const exchange = await hre.ethers.getContractAt("Exchange","0x1d67E35482a74661d287686F034dafd39352ccC3",signer);
    const loanPool = await hre.ethers.getContractAt("LoanPool","0xdbAf4a1447A5D76c8255C6F0c098467fDa1C3Da1",signer);

    const filter = exchange.filters.NewPosition(null, "0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42", null, null,null);

    // Get past events for the NewPosition event
    // exchange.queryFilter(filter, 9122471, 'latest')
    //   .then((events) => {
    //     events.forEach((event) => {
    //         event.getBlock().then((receipt) => {
    //             const { tradeId, trader, amm, side, timeStamp } = event.args;
    //             console.log(`NewPosition event emitted with trade ID ${tradeId.hash} by trader ${trader} on AMM ${amm} with side ${side} at ${timeStamp}:`);
    //             // console.log(event);
    //             console.log('----------------------');
    //           console.log('Transaction receipt:');
    //           console.log(receipt.timestamp);
    //         });
    //     });
      // });

      //getAllliquidations
      const filter2 = exchange.filters.Liquidated(null);
      exchange.queryFilter(filter2, 9122471, 'latest').then((events) => {
        events.forEach((event) => {
            event.getBlock().then((receipt) => {
                const { tradeId} = event.args;
                console.log(`Liquidation event emitted with trade ID ${tradeId.hash} by trader `);
                console.log(event);
                console.log('----------------------');
              console.log('Transaction receipt:');
              console.log(receipt.timestamp);
            });
        });
      });

}
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });