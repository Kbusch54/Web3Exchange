// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./tokens/StakingPoolAmm.sol";

import "hardhat/console.sol";

//@TODO: add debt mode for insurance fund
//@TODO: see MMR for liquidation
//@TODO: add events
contract LoanPool is StakingPoolAmm{

    constructor(
            string memory _name,
            string memory _symbol,
            // address _vault,
            address _usdc
        ) StakingPoolAmm(_name,_symbol,_usdc){ 
    }
    uint MMR=50000; //5% or .005 mmr used to calculate minimum margin requirments for liquidiation
    uint public maxLev=20;
    uint interestPeriod = 10; //10 blocks

    uint public loanInterestRate =10000;//1% interest rate 6 decimal places


    mapping(bytes=>uint) public borrowedAmounts;
    mapping(bytes=>uint) public tradeInterestPeriod;

    function borrow(bytes memory _tradeId, uint _margin, uint _leverage,uint _totalMargin) external returns(uint loanAmt, uint minimumMarginReq,bool check){
        // //check minimums
        require(_leverage<=maxLev,'Max leverage exceeded');
        uint _loanAmt = _margin*(_leverage);
        require(uintToFixed(_totalMargin)/(_loanAmt+borrowedAmounts[_tradeId]) >= MMR, "LoanPool: under minimum margin requirement");
        require(uintToFixed(loanedUsdc + _loanAmt)/totalUsdcSupply <= maxLoan, "LoanPool: Max loan reached");
        require(_loanAmt < availableUsdc, "Not enough USDC in pool");
        borrowedAmounts[_tradeId] += _loanAmt;
        
        IERC20(USDC).approve(msg.sender, _loanAmt);
        loanedUsdc += _loanAmt;
        tradeInterestPeriod[_tradeId] = block.number;
        loanAmt = _loanAmt;
        minimumMarginReq = fixedToUint(_loanAmt*loanInterestRate);
        updateUsdcSupply();
        check=true;
    }
    function borrowOnTrade(bytes memory tradeId, uint _addAmount,uint _amountLeverage) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest){
       //require minimums
       // new loan amount + old loan amount = total loan amount
       // uintToFixed(totalCollateral)/totalLoanAmount >= MMR

        require(_amountLeverage<=maxLev,'Max leverage exceeded');
        uint _loanAmt = _addAmount*(_amountLeverage);
        require(uintToFixed(loanedUsdc + _loanAmt)/totalUsdcSupply <= maxLoan, "LoanPool: Max loan reached");
        require(_loanAmt < availableUsdc, "Not enough USDC in pool");
        borrowedAmounts[tradeId] += _loanAmt;
        IERC20(USDC).approve(msg.sender, _loanAmt);
        loanedUsdc += _loanAmt;
        tradeInterestPeriod[tradeId] = block.number;
        newLoanAmount = borrowedAmounts[tradeId];
        minimumMarginReq = fixedToUint(borrowedAmounts[tradeId]*loanInterestRate);
        owedInterest = getInterestOwedForAmount(tradeId,_loanAmt);
        updateUsdcSupply();
    }
    function addLeverageOnLoan(bytes memory _tradeId, uint _newLev,uint _oldLev) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest){
       //require minimums
       // new loan amount + old loan amount = total loan amount
       // uintToFixed(totalCollateral)/totalLoanAmount >= MMR
       require(_newLev<=maxLev,'Max leverage exceeded');
       uint currentBorrow = borrowedAmounts[_tradeId];
       uint originalColl= currentBorrow/(_oldLev);
        uint _loanAmt = originalColl*(_newLev);
        require(uintToFixed(loanedUsdc + _loanAmt-currentBorrow)/totalUsdcSupply <= maxLoan, "LoanPool: Max loan reached");
        require(_loanAmt -currentBorrow <= availableUsdc, "Not enough USDC in pool");
        IERC20(USDC).approve(msg.sender, _loanAmt-currentBorrow);
        borrowedAmounts[_tradeId] += _loanAmt -currentBorrow;
        newLoanAmount = borrowedAmounts[_tradeId] - currentBorrow;
        minimumMarginReq = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate);
        owedInterest = getInterestOwedForAmount(_tradeId,_loanAmt);
        updateUsdcSupply();
    }


//pay interest of whole loan and principal of repayed amount????
    function repay(bytes memory _tradeId, uint _amount) external returns(uint newLoanAmount, uint minimumMarginReq,uint owedInterest){
        require(borrowedAmounts[_tradeId] >= _amount,'LoanPool: Amount to repay exceeds loan');
       owedInterest = getInterestOwedForAmount(_tradeId,_amount);
        borrowedAmounts[_tradeId] -= _amount;
        tradeInterestPeriod[_tradeId] = block.number;
        IERC20 usdc = IERC20(USDC);
        require(usdc.transferFrom(msg.sender,address(this), _amount),'Transfer failed');
        availableUsdc += _amount;
        loanedUsdc-= _amount;
        updateUsdcSupply();
        newLoanAmount = borrowedAmounts[_tradeId];
        minimumMarginReq = fixedToUint(borrowedAmounts[_tradeId]*loanInterestRate);
    }
    function getInterestOwedForAmount(bytes memory _tradeId, uint _amount) public view returns(uint interestOwed){
          uint interestMultiplyer = (block.number-tradeInterestPeriod[_tradeId])/interestPeriod;
        uint _interest = fixedToUint(_amount*loanInterestRate) *interestMultiplyer;
        interestOwed = _interest;
    }

    function loanDebt(bytes memory _tradeId) external view returns(uint){
        return borrowedAmounts[_tradeId];
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function setMaxLev(uint _maxLev) internal {
        maxLev = _maxLev;
    }
    function setMMR(uint _mmr) external {
        MMR = _mmr;
        maxLev = 1000000/MMR;
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