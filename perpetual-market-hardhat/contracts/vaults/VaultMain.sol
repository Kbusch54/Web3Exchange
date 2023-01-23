// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../vaults/VaultForLoanPools.sol";
import "../Interfaces/IExchange.sol";
import "../Interfaces/ILoanPool.sol";
import "hardhat/console.sol";
 
contract VaultMain is VaultForLoanPools{
address exchange;
mapping(address=>address)ammToPool;
    constructor(address _usdc,address [] memory _pools,address _exchange)VaultForLoanPools(_usdc,_pools){
        exchange = _exchange;
    }

    //checks here
    function registerPool(address _pool,address _amm)public{
        ammToPool[_amm] = _pool;
    }

     // functions for borrowing and repaying //only for exchange
    //repay loan
    function repayLoan(bytes memory _tradeId, uint _amount)public returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq){
        //exit position of amount wanting to repay
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
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
    function secureLoanAndTrade(bytes memory  _tradeId, uint _leverage, uint _collateral)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        //check if enough balance
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
        
        ILoanPool stake = ILoanPool(_pool);
        (uint loanAmt,uint minMargReq,bool check) = stake.borrow(_tradeId,_collateral,_leverage);
        require(availableBalance[_trader] >= _collateral+minimumMarginReq,"not enough balance");
        require(check,"borrow failed");
        // change balances
        require(IERC20(Usdc).transferFrom(_pool,address(this),loanAmt),"transfer failed");
        //might change to not include margin req

        newBalance = availableBalance[_trader] -= _collateral + minMargReq;
        tradeCollateral[_tradeId] += _collateral;
        minimumMarginReq =tradeInterest[_tradeId] += minMargReq;
        _tradeBalance = tradeBalance[_tradeId] += loanAmt;
        poolOutstandingLoans[_pool] += loanAmt;
        _check =check;
    }
    //internal functions
    function exitPosition(bytes memory  _tradeId,address _trader)internal returns(int addedAvailableBalance){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
          uint _collateral = tradeCollateral[_tradeId];
            addedAvailableBalance = calculateCollateral(_tradeId);
            tradeCollateral[_tradeId] = 0;
            availableBalance[_trader] += addedAvailableBalance>0? uint(addedAvailableBalance):0;

    }
    function calculateCollateral(bytes memory  _tradeId)public  returns(int _collateral){
        // (address _pool,,,)=decodeTradeId(_tradeId);
        uint _interest = getInterestOwed(_tradeId);
        console.log("interest",_interest);
        IExchange _exchange = IExchange(exchange);
        int cumulativeFFR = _exchange.getTotalFundingRate(_tradeId);
        uint inititalCollateral = tradeCollateral[_tradeId];
        _collateral = int(inititalCollateral) - int(_interest) + (cumulativeFFR*int(inititalCollateral));

    }

    function updateExchange(address _exchange)public{
        exchange = _exchange;
    }
}