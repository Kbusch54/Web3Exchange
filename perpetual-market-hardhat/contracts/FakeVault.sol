// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./tokens/IStakingPoolAmm.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";
contract FakeVault{

    address Usdc;
    address Pool;

    mapping(address=>mapping(uint=>uint)) public balancesForRewards;
    mapping(bytes32=>uint)public tradeBalance;
    mapping(bytes32=>uint)public tradeCollateral;
    mapping(bytes32=>uint)public tradeInterest;
    mapping(address=>uint)public availableBalance;

    constructor(address _usdc,address _stakingPoolAmm){
        Usdc = _usdc;
        Pool = _stakingPoolAmm;
    }

    //just for testing
    function testTradeCollateral(bytes32 _tradeId,uint collateral)public{
         tradeCollateral[_tradeId]+=collateral;
    }

    //public for testing purposes
    function recordInterest(bytes32 _tradeId,uint _amount)public returns(bool){
        //liquidate if not enough collateral
        require(tradeCollateral[_tradeId] >= _amount,"not enough collateral");
        IStakingPoolAmm stake = IStakingPoolAmm(Pool);
        uint indexForStore = stake.updateAndGetCurrentIndex();
        tradeCollateral[_tradeId] -= _amount;
        uint _amt = _amount;
        uint half = _amt/2;
        _amt -= half;
        IERC20(Usdc).approve(Pool,half);
        balancesForRewards[Pool][indexForStore] += _amt;
        stake.takeInterest(half,_amount);
        return true;
    }

    //only for pools to take rewards
    function takeReward(uint _amount,address _staker,uint rewardsIndex)public{
        checkTakeReward(msg.sender,rewardsIndex);
        balancesForRewards[msg.sender][rewardsIndex] -= _amount;
        IERC20(Usdc).transfer(_staker,_amount);

    }
    function checkTakeReward(address _staker,uint rewardsIndex)internal{
         if(balancesForRewards[_staker][rewardsIndex-1]>0){
            balancesForRewards[_staker][rewardsIndex]+=balancesForRewards[_staker][rewardsIndex-1];
         }
    }






    //basic functions for usdc to get into vault
    function deposit(uint _amount)public{
        require(IERC20(Usdc).balanceOf(msg.sender) >= _amount,"not enough balance");
        IERC20(Usdc).transferFrom(msg.sender,address(this),_amount);
        availableBalance[msg.sender] += _amount;
    }
    function withdraw(uint _amount)public{
        require(availableBalance[msg.sender] >= _amount,"not enough balance");
        IERC20(Usdc).transfer(msg.sender,_amount);
        availableBalance[msg.sender] -= _amount;
    }







//basic functions active trades


   
    // add collateral
    function addCollateral(bytes32 _tradeId, uint _amount)public returns(uint duh,uint interestPayed){
        require(availableBalance[msg.sender] >= _amount,"not enough balance");
        availableBalance[msg.sender] -= _amount;
        tradeCollateral[_tradeId] += _amount;
        
    }
    //remove collateral
    function removeCollateral(bytes32 _tradeId, uint _amount)public returns(uint duh,uint interestPayed){
        //checks if there is enough collateral without liquidiation
        require(tradeCollateral[_tradeId] >= _amount,"not enough collateral");
        tradeCollateral[_tradeId] -= _amount;
        availableBalance[msg.sender] += _amount;
    }








// functions for borrowing and repaying 
    //repay loan
    function repayLoan(bytes32 _tradeId, uint _amount)public returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq){
        //exit position of amount wanting to repay
        IERC20(Usdc).approve(Pool,_amount);
        IStakingPoolAmm stake = IStakingPoolAmm(Pool);
        (uint newLoanAmt,uint minMargReq,uint owedInterest) = stake.repay(_tradeId,_amount);
        tradeBalance[_tradeId] = newLoanAmt;
        tradeInterest[_tradeId] = minMargReq;
        bool check =recordInterest(_tradeId,owedInterest);
        require(check,"record interest failed");
            if(tradeCollateral[_tradeId] > 0 && tradeBalance[_tradeId] == 0  && tradeInterest[_tradeId] == 0){
            exitPosition(_tradeId);
        }
        return (owedInterest,newLoanAmt,minMargReq);

    }
    function secureLoanAndTrade(bytes32 _tradeId, uint _leverage, uint _collateral)public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq){
        require(availableBalance[msg.sender] >= _collateral,"not enough balance");
        IStakingPoolAmm stake = IStakingPoolAmm(Pool);
        (uint loanAmt,uint minMargReq,bool check) = stake.borrow(_tradeId,_collateral,_leverage);
        require(check,"borrow failed");
        // change balances
        newBalance = availableBalance[msg.sender] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        minimumMarginReq =tradeInterest[_tradeId] += minMargReq;
        /**
         * execute trade
         */
        _tradeBalance = tradeBalance[_tradeId] += loanAmt;
    
        _check =check;

    }
    function exitPosition(bytes32 _tradeId)public returns(uint _collateral){
       require(tradeBalance[_tradeId] == 0,"no position");
       require(tradeInterest[_tradeId] == 0,"no interest");
         require(tradeCollateral[_tradeId] > 0,"no collateral");
          _collateral = tradeCollateral[_tradeId];
            tradeCollateral[_tradeId] = 0;
            availableBalance[msg.sender] += _collateral;

    }



    //view functions
    function getInterestOwed(bytes32 _tradeId)public view returns(uint){
        IStakingPoolAmm stake = IStakingPoolAmm(Pool);
        return stake.getInterestOwedForAmount(_tradeId,tradeBalance[_tradeId]);
    }
  
}
