// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "VaultForLoanPool.sol";
import "IExchange.sol";
 
contract VaultMain is VaultForLoanPool{
address exchange;
    constructor(address _usdc,address _pool,address _exchange)VaultForLoanPool(_usdc,_pool){
        exchange = _exchange;
    }

     // functions for borrowing and repaying //only for exchange
    //repay loan
    function repayLoan(bytes32 _tradeId, uint _amount)public returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq){
        //exit position of amount wanting to repay
        (address _pool,,,address _trader)=decodeTradeId(_tradeId);
        IERC20(Usdc).approve(_pool,_amount);
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        (uint newLoanAmt,uint minMargReq,uint owedInterest) = stake.repay(_tradeId,_amount);
        //
        //calculate collaterral
        //
        tradeBalance[_tradeId] = newLoanAmt; 
        tradeInterest[_tradeId] = minMargReq;
        poolOutstandingLoans[_pool] -= _amount;
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
        require(IERC20(Usdc).transferFrom(_pool,address(this),loanAmt),"transfer failed");
        require(availableBalance[_trader] >= _collateral+minMargReq,"To low of balance");
        newBalance = availableBalance[_trader] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        minimumMarginReq =tradeInterest[_tradeId] += minMargReq;
        _tradeBalance = tradeBalance[_tradeId] += loanAmt;
        poolOutstandingLoans[_pool] += loanAmt;
        _check =check;
    }
    //internal functions
    function exitPosition(bytes32 _tradeId,address _trader)internal returns(int addedAvailableBalance){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
          uint _collateral = tradeCollateral[_tradeId];
            tradeCollateral[_tradeId] = 0;
            addedAvailableBalance = calculateCollateral(_tradeId);
            availableBalance[_trader] += _collateral;

    }
    function calculateCollateral(bytes32 _tradeId)public view returns(int _collateral){
        (address _pool,,,)=decodeTradeId(_tradeId);
        uint _interest = getInterestOwed(_tradeId);
        IExchange _exchange = IExchange(exchange);
        int cumulativeFFR = _exchange.getTotalFundingRate(_tradeId);
        uint inititalCollateral = tradeCollateral[_tradeId];
        _collateral = int(inititalCollateral) - int(_interest) + (cumulativeFFR*int(inititalCollateral));

    }
}