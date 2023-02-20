// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IExchange {
    function openPosition(address amm, uint _leverage, uint _collateral)external returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq);
    function repayLoan(bytes memory _tradeId, uint _amount)external returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq);
    function getTotalFundingRate(bytes memory _tradeId)external view returns(int cumulativeFFR,int side);
    function updatePositionLoanAmount(bytes memory _tradeId, uint _newLoanedAmount)external returns(bool);
    function updatePositionMarginAmount(bytes memory _tradeId, uint _newMargin)external returns(bool);
    function updatePositionLastFundingRate(bytes memory _tradeId, uint _newLastFundingRate)external returns(bool);
}