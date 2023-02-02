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
        ILoanPool stake = ILoanPool(_pool);
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
        (bool pass,  uint _newBalance ,uint  __tradeBalance,uint mmr) =addingLeverage(_tradeId,_collateral,_collateral,_leverage);
        require(pass == true,"adding leverage failed");
        return(true,_newBalance,__tradeBalance,mmr);
    }

    function addLiquidityWithLoan(bytes memory _tradeId, uint _levOnAddedColl, uint _addedColl)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        //get and pay interest
        uint interestOwed = getInterestOwed(_tradeId);
        require(tradeCollateral[_tradeId] >= interestOwed,"not enough balance");
        recordInterest(_tradeId,interestOwed);
        //calculate new collateral
        uint totalCollateral = tradeCollateral[_tradeId] + _addedColl;
        (bool pass,  uint _newBalance,uint  __tradeBalance,uint  mmr) =addingLeverage(_tradeId,_addedColl,totalCollateral,_levOnAddedColl);
        require(pass == true,"adding leverage failed");
        return(true,_newBalance,__tradeBalance,mmr);
    }
    //internal functions
    function exitPosition(bytes memory  _tradeId,address _trader)internal returns(int addedAvailableBalance){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
            addedAvailableBalance = calculateCollateral(_tradeId);
            tradeCollateral[_tradeId] = 0;
            availableBalance[_trader] += addedAvailableBalance>0? uint(addedAvailableBalance):0;
    }
    function addingLeverage(bytes memory _tradeId , uint _newCollateral,uint _totalCollateral,uint _lev)internal returns(bool pass,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
        (uint loanAmt,uint minMargReq,bool check) = ILoanPool(_pool).borrow(_tradeId,_newCollateral,_lev,_totalCollateral);
        require(availableBalance[_trader] >= _newCollateral+minimumMarginReq,"not enough balance");
        require(check,"borrow failed");
        // change balances
        require(IERC20(Usdc).transferFrom(_pool,address(this),loanAmt),"transfer failed");
        //might change to not include margin req
        newBalance = availableBalance[_trader] -= _newCollateral + minMargReq;
        tradeCollateral[_tradeId] += _newCollateral;
        minimumMarginReq =tradeInterest[_tradeId] += minMargReq;
        _tradeBalance = tradeBalance[_tradeId] += loanAmt;
        poolOutstandingLoans[_pool] += loanAmt;
        pass = true;
    }
    function addLeverageToLoan(bytes memory _tradeId,uint _oldLev, uint _newLev)public returns(bool _check,uint _newTradeBalance,uint _minimumMarginReq){
        //get and pay interest
        // addLeverageOnLoan(bytes memory _tradeId, uint _newLev,uint _oldLev) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest)
        (,,,,address _pool)=decodeTradeId(_tradeId);
        (uint newLoanAmount, uint minimumMarginReq,) = ILoanPool(_pool).addLeverageOnLoan(_tradeId,_newLev,_oldLev);
        require(IERC20(Usdc).transferFrom(_pool,address(this),newLoanAmount),"transfer failed");
        tradeBalance[_tradeId] += newLoanAmount;
        tradeInterest[_tradeId] = minimumMarginReq;
        poolOutstandingLoans[_pool] += newLoanAmount;
        _minimumMarginReq = tradeInterest[_tradeId];
        _newTradeBalance = tradeBalance[_tradeId];
        //pay interest 
        uint interestOwed = getInterestOwed(_tradeId);
        require(tradeCollateral[_tradeId] >= interestOwed,"not enough balance");
        _check =recordInterest(_tradeId,interestOwed);
    }
    function calculateCollateral(bytes memory  _tradeId)public view returns(int _collateral){
        // (address _pool,,,)=decodeTradeId(_tradeId);
        uint _interest = getInterestOwed(_tradeId);
        // IExchange _exchange = IExchange(exchange);
        // int cumulativeFFR = _exchange.getTotalFundingRate(_tradeId);
        int cumulativeFFR = 0;
        uint inititalCollateral = tradeCollateral[_tradeId];
        _collateral = int(inititalCollateral) - int(_interest) + (cumulativeFFR*int(inititalCollateral));

    }

    function updateExchange(address _exchange)public{
        exchange = _exchange;
    }
}