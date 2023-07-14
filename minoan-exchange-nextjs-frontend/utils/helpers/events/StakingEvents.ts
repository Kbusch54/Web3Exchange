import { ethers } from "ethers";
import { cache } from "react";
import { StakingAbi } from "utils/abis";
import { staking } from "utils/address";
import { Connector, useAccount } from "wagmi";
import { alchemyProvider } from "wagmi/dist/providers/alchemy";


// const filter = exchange.filters.NewPosition(null, "0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42", null, null,null);
const stakingArr: { staker: any; staked: any; date: number; ammPool: any; }[] = [];

// @ts-ignore
// export const getStakingEvents = cache(async() =>{



//     const stakeCon = new ethers.Contract(staking,StakingAbi,undefined);

//     const stakingFilter = stakeCon.filters.Stake(null,null,null,null,null);
//  stakeCon.queryFilter(stakingFilter, 9122471,'latest')
//  .then((events) => {
//         console.log('stakingFilter after it',events)
//     events.forEach((event) => {
//         event.getBlock().then((receipt) => {
//             console.log('recipet',receipt)
//             // @ts-ignore
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
//     console.log('stakingFilter',stakingFilter)
//     return stakingArr;
// });