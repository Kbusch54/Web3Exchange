// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "VaultForLoanPool.sol";
 
contract VaultMain is VaultForLoanPool{

    constructor(address _usdc,address _pool)VaultForLoanPool(_usdc,_pool){
    }

     // functions for borrowing and repaying //only for exchange
    //repay loan
    function repayLoan(bytes32 _tradeId, uint _amount)public returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq){
        //exit position of amount wanting to repay
        (address _pool,,,address _trader)=decodeTradeId(_tradeId);
        IERC20(Usdc).approve(_pool,_amount);
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        (uint newLoanAmt,uint minMargReq,uint owedInterest) = stake.repay(_tradeId,_amount);
        tradeBalance[_tradeId] = newLoanAmt;
        tradeInterest[_tradeId] = minMargReq;
        bool check =recordInterest(_tradeId,owedInterest);
        require(check,"record interest failed");
            if(tradeCollateral[_tradeId] > 0 && tradeBalance[_tradeId] == 0  && tradeInterest[_tradeId] == 0){
            exitPosition(_tradeId,_trader);
        }
        return (owedInterest,newLoanAmt,minMargReq);

    }
    //only for exchnage
    function secureLoanAndTrade(bytes32 _tradeId, uint _leverage, uint _collateral)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        //check if enough balance
        (address _pool,,,address _trader)=decodeTradeId(_tradeId);
        require(availableBalance[_trader] >= _collateral,"not enough balance");
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        (uint loanAmt,uint minMargReq,bool check) = stake.borrow(_tradeId,_collateral,_leverage);
        require(check,"borrow failed");
        // change balances
        newBalance = availableBalance[_trader] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        minimumMarginReq =tradeInterest[_tradeId] += minMargReq;
        /**
         * execute trade
         */
        _tradeBalance = tradeBalance[_tradeId] += loanAmt;
    
        _check =check;

    }
    //internal functions
    function exitPosition(bytes32 _tradeId,address _trader)internal returns(uint _collateral){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
          _collateral = tradeCollateral[_tradeId];
            tradeCollateral[_tradeId] = 0;
            availableBalance[_trader] += _collateral;

    }
}