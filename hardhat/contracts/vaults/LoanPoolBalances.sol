// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LoanPoolBalances{

    mapping(address=>uint)public poolTotalUsdcSupply;
    mapping(address=>uint)public poolOutstandingLoans;
    mapping(address=>uint)public poolAvailableUsdc;

    mapping(address=>uint)public maxLoan;
    mapping(address=>uint)public minLoan;
    mapping(address=>uint)public loanInterestRate;
    mapping(address=>uint)public interestPeriods;
    mapping(address=>uint)public mmr;
    mapping(address=>uint)public minHoldingsReqPercentage;


    //theseus dao limits
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


    mapping(bytes=>uint)public borrowedAmount;
    mapping(bytes=>uint)public loanInterestLastPayed;
    mapping(bytes=>uint)public interestForTrade;




    mapping(address=>uint)public currentRewardIndex;
    mapping(address=>mapping(uint=>uint)) public balancesForRewards;
    mapping(address=>uint)public rewardDuration;
    mapping(address=>uint)public rewardPnlPercentage;


    mapping(address=>address)public dao;
    address public theseusDao;

}