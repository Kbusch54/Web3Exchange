// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Balances{
    address Usdc;
 
constructor(address _usdc){
    Usdc = _usdc;

}

    mapping(address=>mapping(uint=>uint)) public balancesForRewards;
    mapping(bytes=>uint)public tradeBalance;
    mapping(bytes=>uint)public tradeCollateral;
    mapping(bytes=>uint)public tradeInterest;
    mapping(address=>uint)public availableBalance;
    mapping(address=>uint)public totalTradeCollateral; //for liquidation purposes
    mapping(address=>uint)public poolOutstandingLoans;


function readBalanceRewards(address _loanPool,uint _indexId)public view returns(uint){
    return balancesForRewards[_loanPool][_indexId];
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
}