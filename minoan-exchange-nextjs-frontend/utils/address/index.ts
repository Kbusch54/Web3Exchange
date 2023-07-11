import { Address } from "wagmi/dist"
// 0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42
const ariadneTesla:Address ="0xD2509b5AFDfd79d168422Df655d147038E66489D"
const ariadneGoogle:Address ="0x7ED183624e901e2ddbC01668f5207848FC34C20a"
const ariadneMeta:Address ="0x99974C73ef56a248dEeA5be2c8f5F4794217ae4d"
const createAriadnes:Address ="0x638938cb83b21eb773C8e521ee5380D1eC502c7a"
const TeslaAmm:Address ="0xc9d92eAA14364713277cD21E2F7912E96c347AE4"
const GoogleAmm:Address ="0x3951c8AF6Cbfd7e4Fb0C694b1CA366abE8F5c1AB"
const MetaAmm:Address ="0x3E06D89ae0420130CA39fC5b3f26C10177Ad28a9"
const ammViewer:Address ="0xdB5548525e98236785869f92de4207e11EFBc8DE"
const loanpool:Address ="0x54584803e3b0F7DEec387b5CfB22Aa6FFDc15166"
const staking:Address ="0x68DfA613C88c116EF921099C0481B46a9FC4e587"
const exchange:Address ="0x17a9723aa61b08C900603aa921Da26019A79cb8f"
const theseus:Address ="0xC739eC1BF33C6E09468FF033A35f6A957F44af93"
const poolTokens:Address ="0x3db47F0D5C5348aBceC79dB0b05205EBea1C3C0E"
const stakingHelper:Address ="0x44DD0A89DcB40A7423C293d8eF193789B7586c0c"
const payload:Address ="0xA6711930c6b32bDF50a04c72539D09627b2EAE97"
const exchangeViewer:Address ="0xAe2a5e1fA5012982CCE291E5918e7Bf3Ff156d2a"
const usdc:Address ="0x7b437DCDb45650c7cB3526F856fCd474D94EF2b2"
const library:Address ="0x237F8508939D816C3F5E88d9F10ec144e4Cbc1fD"
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


