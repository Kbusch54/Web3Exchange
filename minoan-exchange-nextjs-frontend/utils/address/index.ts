import { Address } from "wagmi/dist"
// 0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42
const ariadneTesla:Address ="0x164444b95f54E619438C3132967464D07EE93bB2"
const ariadneGoogle:Address ="0xc60aD0B017C6E1BC55D5d7fcEa9F2037b26a8b01"
const ariadneMeta:Address ="0xC48c8324938F52103d557153ca07a2529919d9b6"
const createAriadnes:Address ="0x0F19f9B392a9ECcF0518F4af2dB27a9A39D25395"
const TeslaAmm:Address ="0xB9bbeB3B30C89b34F1D06434164Fd27beDb565E4"
const GoogleAmm:Address ="0xf25Eb8B7817797B86aae3c19fdDcF787323e2152"
const MetaAmm:Address ="0x0FFaE85a8f923E3d078598083B88c194442B6544"
const ammViewer:Address ="0xD2b4FaBEA3A7a620c091EE447775733B0Fe6C23F"
const loanpool:Address ="0x8071f9eF2715d99A9C6E59A90C7adD22357F251b"
const staking:Address ="0x0cb6aa84aDaadeA6aE7E7B5616207c8A09F7360b"
const exchange:Address ="0xF94Ad8f331830D353782bac55AD4965f35aC3cD6"
const theseus:Address ="0x9971256545fe1eE74B224b3D0cA5B4e6DDc3283d"
const poolTokens:Address ="0x6BbD089D16C3dd4EE54297EbCeb4489885C6263b"
const stakingHelper:Address ="0x0Cfc74925b7D381D22B6182bb0c8390345AD68f3"
const payload:Address ="0xcC26b3C51Fbbe71BeE6849CDA830b8c4De55Bc20"
const exchangeViewer:Address ="0xE7A6830cffa37909f0438e4a545650Eb8AbfaEaa"
const usdc:Address ="0x63df0332A87393687Fa87F432CcD8f99DEE8Daa6"
const library:Address ="0x55e149319D2fC44AFB972dF034940906e4c806c9"
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


