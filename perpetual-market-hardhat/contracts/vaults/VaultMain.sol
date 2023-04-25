// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "../vaults/VaultForLoanPools.sol";
import "../Interfaces/IExchange.sol";
import "../Interfaces/ILoanPool.sol";
import "hardhat/console.sol";

//@TODO: add liquidation chech
//@TODO: add liquidation functions
//@TODO: add events

 
contract VaultMain is VaultForLoanPools{
address exchange;
mapping(address=>address)ammToPool;
uint public feeRate = 1000;
    constructor(address _usdc,address [] memory _pools,address _exchange)VaultForLoanPools(_usdc,_pools){
        exchange = _exchange;
    }

    //checks here
    function registerPool(address _pool,address _amm)public{
        ammToPool[_amm] = _pool;
    }

     // functions for borrowing and repaying //only for exchange
    //repay loan
    //@TODO: add checks for liquidation and MMR
    function repayLoan(bytes memory _tradeId, uint _amount,uint _usdcAmt)public returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq){
        //exit position of amount wanting to repay
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
        IERC20(Usdc).approve(_pool,_amount);
        ILoanPool stake = ILoanPool(_pool);
        (uint newLoanAmt,uint minMargReq,uint owedInterest) = stake.repay(_tradeId,_amount);
        //checking balances
        int _pnl = int(_usdcAmt) - int(_amount);
        require(calculatePnl(_tradeId,_pnl),"VAULT MAIN: pnl check failed");
      
        tradeBalance[_tradeId] = newLoanAmt; 
        tradeInterest[_tradeId] = minMargReq;
        poolOutstandingLoans[_pool] -= _amount;
        bool check =recordInterest(_tradeId,owedInterest);
        require(check,"record interest failed");
         //collateral chsngae
         require(collateralChange(_tradeId,_trader),'VAULT MAIN: collateral change failed');
        return (owedInterest,newLoanAmt,minMargReq);

    }
    //only for exchnage
    function secureLoanAndTrade(bytes memory  _tradeId, uint _leverage, uint _collateral)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        //check if enough balance
        (bool pass,  uint _newBalance ,uint  __tradeBalance,uint mmr) =addingLeverage(_tradeId,_collateral,_collateral,_leverage);
        console.log('trade balance',__tradeBalance);
        require(takeFee(_tradeId,__tradeBalance),"VAULT MAIN: fee failed");

        require(pass == true,"adding leverage failed");
        return(true,_newBalance,__tradeBalance,mmr);
    }

    function addLiquidityWithLoan(bytes memory _tradeId, uint _levOnAddedColl, uint _addedColl)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        //get and pay interest
        (,,,address _trader,)=decodeTradeId(_tradeId);
        require(recordInterest(_tradeId,getInterestOwed(_tradeId)),"record interest failed");
        //calculate new collateral
        collateralChange(_tradeId,_trader);
        (,  uint _newBalance,uint  __tradeBalance,uint  mmr) =addingLeverage(_tradeId,_addedColl,tradeCollateral[_tradeId] + _addedColl,_levOnAddedColl);
        return(true,_newBalance,__tradeBalance,mmr);
    }
    //internal functions
    function calculatePnl(bytes memory _tradeId,int _pnl)internal returns(bool){
        //check if pnl is positive or negative
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
          if(_pnl > 0){
            //profit
            //usdc transfer from pool to vault
                require(ILoanPool(_pool).profitTaken(_pnl),"profit taken failed");
            //credit available balance
                availableBalance[_trader] += uint(_pnl);
        }else{
            //loss
            //collateral - pnl
            if(tradeCollateral[_tradeId] <= uint(_pnl)){
                //liquidate
                console.log("liquidate");
                // liquidate(_tradeId,_trader);
            }
            tradeCollateral[_tradeId] -= uint(_pnl*-1);
                //check if mmr is met than liquidate 
        }
        return true;
    }
    function collateralChange(bytes memory _tradeId,address _trader)internal returns(bool){
           if(tradeCollateral[_tradeId] > 0 && tradeBalance[_tradeId] == 0  && tradeInterest[_tradeId] == 0){
            exitPosition(_tradeId,_trader);
            }else{
                //calculate collateral
               (int _collateral,bool hasChanged)= calculateCollateral(_tradeId);
                require(_collateral >= 0,"collateral is negative");
                //liquidate
                if(hasChanged == true){
                    tradeCollateral[_tradeId] = uint(_collateral);
                    IExchange(exchange).updatePositionMarginAmount(_tradeId,uint(_collateral));
                }
            }
        return true;
    }
    function exitPosition(bytes memory  _tradeId,address _trader)internal returns(int addedAvailableBalance){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
            (int _newCollateral,) = calculateCollateral(_tradeId);
            addedAvailableBalance = _newCollateral;
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
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
        (uint newLoanAmount, uint minimumMarginReq,) = ILoanPool(_pool).addLeverageOnLoan(_tradeId,_newLev,_oldLev);
        require(IERC20(Usdc).transferFrom(_pool,address(this),newLoanAmount),"transfer failed");
        tradeBalance[_tradeId] += newLoanAmount;
        tradeInterest[_tradeId] = minimumMarginReq;
        poolOutstandingLoans[_pool] += newLoanAmount;
        _minimumMarginReq = tradeInterest[_tradeId];
        _newTradeBalance = tradeBalance[_tradeId];
        //pay interest 
        _check =recordInterest(_tradeId,getInterestOwed(_tradeId));
        collateralChange(_tradeId,_trader);
    }
    function calculateCollateral(bytes memory  _tradeId)public view returns(int _collateral,bool hasChanged){
        // (address _pool,,,)=decodeTradeId(_tradeId);
        uint _interest = getInterestOwed(_tradeId);
        // IExchange _exchange = IExchange(exchange);
        (int cumulativeFFR,int side) = IExchange(exchange).getTotalFundingRate(_tradeId);

        uint inititalCollateral = tradeCollateral[_tradeId];
        console.log("inititalCollateral",inititalCollateral);
        console.log("cumulativeFFR",uint(cumulativeFFR));
        uint intialTradeBalance = tradeBalance[_tradeId];
        console.log("intialTradeBalance",intialTradeBalance);
        console.log('calulation',uint(cumulativeFFR*int(intialTradeBalance)/100000000*side));
        console.log('interest',_interest);
        _collateral = int(inititalCollateral) - int(_interest) + (cumulativeFFR*int(intialTradeBalance)/100000000*side);
        if(int(inititalCollateral) == _collateral){
           hasChanged = false;
        }else{
            hasChanged = true;
        }

    }

    function takeFee(bytes memory _tradeId,uint _amount)internal returns(bool){
        (,,,address _trader,address _pool)=decodeTradeId(_tradeId);
        uint fee = _amount/feeRate;
        require(availableBalance[_trader]-fee >= 0,"not enough balance");
        availableBalance[_trader] -= fee;
        uint amtToDao = fee/2;
        require(IERC20(Usdc).transfer(_pool,fee-amtToDao),"fee transfer failed");
        // require(IERC20(Usdc).transfer(dao,amountToDao),"pool transfer failed");

        return true;
    }


//DAO
    function updateExchange(address _exchange)public{
        exchange = _exchange;
    }
    function updateFee(uint _feeRate)public{
        feeRate = _feeRate;
    }
}