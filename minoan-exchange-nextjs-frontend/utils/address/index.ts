import { Address } from "wagmi/dist"
// 0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42
const ariadneTesla:Address ="0x390A389995b6CCD27389C5F892f59a81D4Bc060E"
const ariadneGoogle:Address ="0x5652161D00d4Fa118D1246aaA9f4A1092027D0b8"
const ariadneMeta:Address ="0x3ba1888f9B1946157B51C539e78C976F247fd387"
const createAriadnes:Address = "0xFB88e0AA074Bab25E735885A97d1EA30A107CD47"
const TeslaAmm:Address = "0x0AfB725e85F1f43DdFEeaF3195Adb800ed6ff2B0"
const GoogleAmm:Address = "0x54751a42c1dDE97d346ED3026c1213aB8D84366d"
const MetaAmm:Address = "0x361beB3582eE3617d18C42E456e7C3e3E7ccc64f"
const ammViewer:Address = "0x66AF419c51950ed691862EecBb0Ac50099dd551C"
const loanpool:Address = "0x93875aa3abAB98Ca1b57cD7aeCa38Bdb1384FF5A"
const staking:Address = "0x9e20Afa5684D16A3Be9AFADC6Ee21D3F58991eBa"
const exchange:Address = "0xFBe76B20997f18C191E02b81E0855Efa5A83d733"
const theseus:Address = "0x5f96762CD2878c99177F03F3BC803fEA9EA6D421"
const poolTokens:Address = "0x9f0665B77E7d11845341E3A9a2C90699E684368e"
const stakingHelper:Address = "0x6DF34C55b1fdFBB5ea668B3c3F42DC602371da48"
const payload:Address = "0x32CDF4082218482784fd4773DF9DbbdE1e72e4C3"
const exchangeViewer:Address = "0x2afa25a9BCccb8fec11D078942f9b7E1A1333E93"
const usdc:Address = "0xC160e2865cA738fFe966dA5A929b0108c16a9F11"
const library:Address ="0x76ea8684ec9Af17721f6b2412E2C376f595f4030"
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


