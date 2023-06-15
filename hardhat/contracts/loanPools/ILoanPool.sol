   // SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
interface ILoanPool{

    function repayLoan(bytes memory _tradeId, uint _amount,address _ammPool)external  returns(bool);

    function fullRepaymentFailed(bytes memory _tradeId,address _amm)external ;


    function borrow(bytes memory _tradeId, address _ammPool, uint _newLoan,uint _tradeCollateral)external  returns(bool);

    function interestOwed(bytes memory _tradeId,address _ammPool)external view returns(uint _totalInterest,uint _toPools);


    function payInterest(bytes memory _tradeId)external returns(bool);

    function tradingFeeCalc(address _amm, uint _loanAmt)external  returns(uint feeToPool,uint feeToDAO);

    function subDebt(uint _amount,address _ammPool)external;
    function addDebt(uint _amount,address _ammPool)external;
}