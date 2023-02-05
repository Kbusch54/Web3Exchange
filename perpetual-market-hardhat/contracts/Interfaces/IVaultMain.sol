// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVaultMain {
    function secureLoanAndTrade(bytes memory _tradeId, uint _leverage, uint _collateral)external returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq);
    function repayLoan(bytes memory _tradeId, uint _amount,uint _usdcAmt)external returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq);
    function addLeverageToLoan(bytes memory _tradeId,uint _oldLev, uint _newLev)external returns(bool _check,uint _newTradeBalance,uint _minimumMarginReq);
    function addLiquidityWithLoan(bytes memory _tradeId, uint _levOnAddedColl, uint _addedColl)external returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq);
}