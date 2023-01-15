// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./tokens/StakingPoolAmm.sol";
import "./FakeVault.sol";

contract LoanPool is StakingPoolAmm{

    constructor(
            string memory _name,
            string memory _symbol,
            // address _vault,
            address _usdc
        ) StakingPoolAmm(_name,_symbol,_usdc){ 
    }
    uint MMR=500; //5% or .005 mmr used to calculate minimum margin requirments for liquidiation
    uint public maxLev=15;
    uint interestPeriod = 10; //10 blocks


    mapping(bytes32=>uint) public borrowedAmounts;
    mapping(bytes32=>uint) public tradeInterestPeriod;

    function borrow(bytes32 _tradeId, uint _margin, uint _leverage) external returns(uint loanAmt, uint minimumMarginReq){
        //check minimums
        require(_leverage<=maxLev,'Max leverage exceeded');
        uint _loanAmt = _margin*(_leverage);
        require((loanedUsdc + _loanAmt)*100000/totalUsdcSupply <= maxLoan, "Currently pool is maxed out");
        require(_loanAmt < availableUsdc, "Not enough USDC in pool");
        borrowedAmounts[_tradeId] += _loanAmt;
        FakeVault vault = FakeVault(Vault);
        require(vault.provideCollateral(_tradeId,_loanAmt),'Loan did not go through');
        updateUsdcSupply();
        tradeInterestPeriod[_tradeId] = block.number;
        loanAmt = _loanAmt;
        minimumMarginReq = fixedToUint(_loanAmt*loanInterestRate);
    }


//pay interest of whole loan and principal of repayed amount????
    function repay(bytes32 _tradeId, uint _amount) external returns(uint newLoanAmount, uint minimumMarginReq){
        require(borrowedAmounts[_tradeId] >= _amount,'Amount to repay is greater than borrowed amount');
        FakeVault vault = FakeVault(Vault);
        uint _interest = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate) *((block.number-tradeInterestPeriod[_tradeId])/interestPeriod);
        uint interestPayed;
        require((,interestPayed) = vault.lowerCollateral(_tradeId,_amount),'Repay did not go through');
        require(interestPayed == _interest,'Interest not payed');
        borrowedAmounts[_tradeId] -= _amount;
        tradeInterestPeriod[_tradeId] = block.number;
        updateUsdcSupply();
        newLoanAmount = borrowedAmounts[_tradeId];
        minimumMarginReq = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate);
    }

    function fixedToUint(uint _fixed) internal pure returns(uint){
        return _fixed/10**6;
    }
    function uintToFixed(uint _uint) internal pure returns(uint){
        return _uint*10**6;
    }
}