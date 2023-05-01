// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// contract UserExchange{
//     address exchnage;
//     address vault;
//     constructor(address _exchange,address _vault){
//         exchnage = _exchange;
//         vault = _vault;
//     }
//     function openPosition(address amm, uint _leverage, uint _collateral)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
//         (bool check,uint newBal,uint tradeBal,uint minMargReq) = IVaultMain(vault).secureLoanAndTrade(tradeId,_leverage,_collateral);
//         return (check,newBal,tradeBal,minMargReq);
//     }
// }