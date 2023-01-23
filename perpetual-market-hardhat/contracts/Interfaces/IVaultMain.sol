// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVaultMain {
    function secureLoanAndTrade(bytes memory _tradeId, uint _leverage, uint _collateral)external returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq);
    function repayLoan(bytes memory _tradeId, uint _amount)external returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq);
}