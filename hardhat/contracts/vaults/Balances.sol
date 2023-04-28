// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Balances{
    address Usdc;
 
constructor(address _usdc){
    Usdc = _usdc;

}
    mapping(bytes=>uint)public tradeBalance;
    mapping(bytes=>uint)public tradeCollateral;
    mapping(bytes=>uint)public tradeInterest;
    mapping(address=>uint)public availableBalance;
    mapping(address=>uint)public totalTradeCollateral; //for liquidation purposes
    // mapping(address=>mapping(address=>uint))public poolOutstandingLoans;



      //basic functions for usdc to get into vault
    function deposit(uint _amount)public{
        require(IERC20(Usdc).balanceOf(msg.sender) >= _amount,"not enough balance");
          require(IERC20(Usdc).transferFrom(msg.sender,address(this),_amount),'transfer failed');
        availableBalance[msg.sender] += _amount;
    }
    function withdraw(uint _amount)public{
        require(availableBalance[msg.sender] >= _amount,"not enough balance");
        IERC20(Usdc).transfer(msg.sender,_amount);
        availableBalance[msg.sender] -= _amount;
    }
}