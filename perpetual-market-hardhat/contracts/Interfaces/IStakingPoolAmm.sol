// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IStakingPoolAmm{
    function takeInterest(uint _amt,uint _totalAmt)external;
    function getCurrentindex() external view returns(uint);
    function updateAndGetCurrentIndex() external returns(uint);
    function borrow(bytes memory _tradeId, uint _margin, uint _leverage) external returns(uint loanAmt, uint minimumMarginReq,bool check);
    function repay(bytes memory _tradeId, uint _amount) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest);
    function getInterestOwedForAmount(bytes memory _tradeId, uint _amount) external view returns(uint interestOwed);
}
    