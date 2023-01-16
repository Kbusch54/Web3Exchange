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

    uint public loanInterestRate =10000;//1% interest rate


    mapping(bytes32=>uint) public borrowedAmounts;
    mapping(bytes32=>uint) public tradeInterestPeriod;

    function borrow(bytes32 _tradeId, uint _margin, uint _leverage) external returns(uint loanAmt, uint minimumMarginReq,bool check){
        //check minimums
        require(_leverage<=maxLev,'Max leverage exceeded');
        uint _loanAmt = _margin*(_leverage);
        require(uintToFixed(loanedUsdc + _loanAmt)/totalUsdcSupply <= maxLoan, "LoanPool: Max loan reached");
        require(_loanAmt < availableUsdc, "Not enough USDC in pool");
        borrowedAmounts[_tradeId] += _loanAmt;
        availableUsdc -= _loanAmt;
        loanedUsdc += _loanAmt;
        tradeInterestPeriod[_tradeId] = block.number;
        loanAmt = _loanAmt;
        minimumMarginReq = fixedToUint(_loanAmt*loanInterestRate);
        updateUsdcSupply();
        check=true;
    }


//pay interest of whole loan and principal of repayed amount????
    function repay(bytes32 _tradeId, uint _amount) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest){
        require(borrowedAmounts[_tradeId] >= _amount,'LoanPool: Amount to repay exceeds loan');
        uint interestMultiplyer = (block.number-tradeInterestPeriod[_tradeId])/interestPeriod>0?(block.number-tradeInterestPeriod[_tradeId])/interestPeriod:1;
        owedInterest = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate) *interestMultiplyer;
        borrowedAmounts[_tradeId] -= _amount;
        tradeInterestPeriod[_tradeId] = block.number;
        availableUsdc += _amount;
        loanedUsdc-= _amount;
        updateUsdcSupply();
        newLoanAmount = borrowedAmounts[_tradeId];
        minimumMarginReq = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate);
    }
    function getInterestOwedForAmount(bytes32 _tradeId, uint _amount) external view returns(uint interestOwed){
          uint interestMultiplyer = (block.number-tradeInterestPeriod[_tradeId])/interestPeriod>0?(block.number-tradeInterestPeriod[_tradeId])/interestPeriod:1;
        uint _interest = fixedToUint(_amount*loanInterestRate) *interestMultiplyer;
        interestOwed = _interest;
    }

    function loanDebt(bytes32 _tradeId) external view returns(uint){
        return borrowedAmounts[_tradeId];
    }








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function setMaxLev(uint _maxLev) external {
        maxLev = _maxLev;
    }
    function setMMR(uint _mmr) external {
        MMR = _mmr;
    }
    function setInterestPeriod(uint _interestPeriod) external {
        interestPeriod = _interestPeriod;
    }

    // rewardPnlPercentage
    function setRewardPnlPercentage(uint _rewardPnlPercentage) external  {
        rewardPnlPercentage = _rewardPnlPercentage;
    }
        // maxLoan
    function setMaxLoan(uint _maxLoan) external  {
        maxLoan = _maxLoan;
    }
        // loanInterestRate
    function setLoanInterestRate(uint _loanInterestRate) external  {
        loanInterestRate = _loanInterestRate;
    }
        // rewardBlockPeriod
    function setRewardBlockPeriod(uint _rewardBlockPeriod) external  {
        rewardBlockPeriod = _rewardBlockPeriod;

    }
    function updateVault(address _vault) external  {
        Vault = _vault;
    }
}