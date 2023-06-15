import { Address } from "wagmi/dist"
// 0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42
const ariadneTesla:Address ='0xA55340Cb5e6fBB8e5Bf6Ded140056e09Dc172761'
const ariadneGoogle:Address ='0x1026B9CDBdAA2edaC4F1d398933fEF47Ad2F44B5'
const ariadneMeta:Address ='0x4Db44592B3BD30940bf72BCd3e8C0d5F3fB4a707'
const createAriadnes:Address = "0x8A14D2a9669D3cEEc3038A7d7DBBBA49fe517e85"
const TeslaAmm:Address ="0xd03605192d07Be814B409293beE01B0abE0B1685"
const GoogleAmm:Address ="0x45C415C7C9fa0081d3244612902b52da6a22f439"
const MetaAmm:Address ="0xB77B90B93be5b2964dEf0faC6F5C372d95AB3776"
const ammViewer:Address ="0xE1c16CA78CAfD20044238D8A08Cd983249870221"
const loanpool:Address ="0xd13427B7aa8Ef6f3B009F07D3c6762a3354B3C68"
const staking:Address ="0x07d1495D080f2C986C9e87C916326eFd2E6c6015"
const exchange:Address ="0x909ABE9609cC77286f5201d6CfFB91aCefC86903"
const theseus:Address ="0x831EA4685Fc3b8fF331eB4887070Ba42C15FC8E4"
const poolTokens:Address ="0xC910f7B18C061a9533E3006893F9174B8D58c36e"
const stakingHelper:Address ="0x8fb047e27c6dc702d2d542e3097660134d8aca0E"
const payload:Address ="0x31b1b5d2e0D99b0A5512f1e11EC59BF843d1dD98"
const exchangeViewer:Address ="0x8E63036a15314045b2C66f4Ef694421643a66764"
const usdc:Address ="0xe5E99f23c8a14568936b64445ee76B919B2A956f"
const library:Address ='0xbab8bE5a29BeEF17A644931829b260F1dc12265d'
export {usdc,exchange,exchangeViewer,payload,poolTokens,theseus,staking,loanpool,ammViewer,MetaAmm,GoogleAmm,TeslaAmm,createAriadnes,library,ariadneMeta,stakingHelper,ariadneGoogle,ariadneTesla
}

// npx graph add 0xE1c16CA78CAfD20044238D8A08Cd983249870221 --abi ../hardhat/artifacts/contracts/amm/AmmViewer.sol/AmmViewer.json --contract-name AmmViewer
// {
//     trades{
//       tradeId
//       created
//       isActive
//       startingCost
      
//       tradeBalance{
//         side
//         LastInterestPayed
//         collateral
//         entryPrice
//         exitPrice
//       }
//     }
//     users{
//       balances{
//         availableUsdc
//         totalCollateralUsdc
//       }
//     }
//   }
// ���\u001d�5�C\u0015:Address�=�\u001dy���DѮ_



// {
//     tradeBalances{
//       collateral
//       id
//       side
//       exitPrice
//       LastInterestPayed
//     }
//   trades{
//     isActive
//     liquidated
//     created
//   }
//   users{
//     balances{
//       availableUsdc
//       totalCollateralUsdc
//     }
//   }
//   }


