// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title LoanPoolBalances
 * @dev A contract for managing loan pool balances and related parameters.
 */
contract LoanPoolBalances {
    // Theseus DAO limits
    uint public maxLoanLimit;
    uint public minLoanLimit;
    uint public maxLoanInterestRateLimit;
    uint public minLoanInterestRateLimit;
    uint public maxInterestPeriodsLimit;
    uint public minInterestPeriodsLimit;
    uint public minMMRLimit;
    uint public maxMMRLimit;
    uint public minHoldingsReqPercentageLimit;
    uint public maxHoldingsReqPercentageLimit;
    uint public maxTradingFeeLimit;
    uint public minTradingFeeLimit;


    // Mappings for storing loan-related data
    mapping(address => uint) public maxLoan;
    mapping(address => uint) public minLoan;
    mapping(address => uint) public loanInterestRate;
    mapping(address => uint) public interestPeriods;
    mapping(address => uint) public mmr;
    mapping(address => uint) public minHoldingsReqPercentage;


    // Mappings for storing trade-related data
    mapping(bytes => uint) public borrowedAmount;
    mapping(bytes => uint) public loanInterestLastPayed;
    mapping(bytes => uint) public interestForTrade;


    //mapping for trading fees
    mapping(address => uint) public tradingFeeLoanPool;


    mapping(address => uint) public debt;

    // // Mappings for storing reward-related data
    // mapping(address => uint) public currentRewardIndex;
    // mapping(address => mapping(uint => uint)) public balancesForRewards;
    // mapping(address => uint) public rewardDuration;
    // mapping(address => uint) public rewardPnlPercentage;

    // Mappings for storing DAO-related data
    mapping(address => address) public dao;
    address public theseusDao;

  
    
}
