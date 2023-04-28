// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./Staking.sol";
import "hardhat/console.sol";
/**
 * @title LoanPool
 * @dev A contract for managing a loan pool with staking functionality.
 */
contract LoanPool is Staking{

    modifier onlyDao(address _ammPool){
        require(msg.sender == dao[_ammPool],'not dao');
        _;
    }
    modifier onlyTheseus {
        require(msg.sender == theseusDao,'not theseus');
        _;
    }

    constructor(address _usdc, address _poolTokens) Staking(_usdc,_poolTokens) {
    }


 /**
     * @dev Function for borrowing from the loan pool.
     * @param _tradeId The unique identifier for the trade.
     * @param _totalCollateral The total collateral for the loan.
     * @param _loanAmount The loan amount to borrow.
     * @param _ammPool The address of the AMM pool.
     * @return true if the borrow is successful, otherwise false.
     */
    function borrow(bytes memory _tradeId, uint _totalCollateral, uint _loanAmount,address _ammPool)internal returns(bool){
        require(_loanAmount >= minLoan[_ammPool],'below min loan');
        require(_loanAmount <= maxLoan[_ammPool],'above max loan');
        uint _minimumHoldings = poolAvailableUsdc[_ammPool]/minHoldingsReqPercentage[_ammPool];
        require(_loanAmount <= poolAvailableUsdc[_ammPool]-_minimumHoldings,'not enough available usdc');
        require(_totalCollateral*10**6 /_loanAmount >= mmr[_ammPool],'not enough collateral');
        borrowedAmount[_tradeId] += _loanAmount;
        poolOutstandingLoans[_ammPool] += _loanAmount;
        poolAvailableUsdc[_ammPool] -= _loanAmount;
        loanInterestLastPayed[_tradeId] = block.timestamp;
        interestForTrade[_tradeId] = loanInterestRate[_ammPool];
        return true;
    }
   /**
     * @dev Function for repaying a loan.
     * @param _tradeId The unique identifier for the trade.
     * @param _amount The amount to repay.
     * @param _ammPool The address of the AMM pool.
     * @return true if the repayment is successful, otherwise false.
     */
    function repayLoan(bytes memory _tradeId, uint _amount,address _ammPool)internal returns(bool){
        require(_amount <= borrowedAmount[_tradeId],'repaying too much');
        require(interestOwed(_tradeId,_ammPool) ==0,'Need To pay interest first');
        borrowedAmount[_tradeId] -= _amount;
        poolOutstandingLoans[_ammPool] -= _amount;
        poolAvailableUsdc[_ammPool] += _amount;
        return true;
    }

    /**
     * @dev Function for adding leverage to a trade.
     * @param _tradeId The unique identifier for the trade.
     * @param _ammPool The address of the AMM pool.
     * @param _newLoan The new loan amount to add.
     * @return true if the operation is successful, otherwise false.
     */
    function addLeverage(bytes memory _tradeId, address _ammPool, uint _newLoan)internal returns(bool){
        uint _totalLoan = _newLoan + borrowedAmount[_tradeId];
        require(interestOwed(_tradeId,_ammPool) ==0,'Need To pay interest first');
        require(_newLoan >= minLoan[_ammPool],'below min loan');
        require(_totalLoan <= maxLoan[_ammPool],'above max loan');
        uint _minimumHoldings = poolAvailableUsdc[_ammPool]/minHoldingsReqPercentage[_ammPool];
        require(_newLoan <= poolAvailableUsdc[_ammPool]-_minimumHoldings,'not enough available usdc');
        borrowedAmount[_tradeId] += _newLoan;
        poolOutstandingLoans[_ammPool] += _newLoan;
        poolAvailableUsdc[_ammPool] -= _newLoan;
        return true;
    }
      /**
     * @dev Function for calculating the interest owed for a trade.
     * @param _tradeId The unique identifier for the trade.
     * @param _ammPool The address of the AMM pool.
     * @return The interest owed for the trade.
     */

    function interestOwed(bytes memory _tradeId,address _ammPool)public view returns(uint){
        uint _interest = interestForTrade[_tradeId]; 
        uint _interestPeriods = (block.timestamp - loanInterestLastPayed[_tradeId])/interestPeriods[_ammPool];
        uint _interestToPay =  (borrowedAmount[_tradeId]*( _interest * _interestPeriods))/(10**6) ;
        return _interestToPay;
    }

    /**
     * @dev Function for paying the interest for a trade.
     * @param _tradeId The unique identifier for the trade.
     * @return true if the interest payment is successful, otherwise false.
     */
    function payInterest(bytes memory _tradeId)internal returns(bool){
        loanInterestLastPayed[_tradeId] = block.timestamp;
        return true;
    }

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setMMR(uint _mmr,address _ammPool)external onlyDao(_ammPool){
        mmr[_ammPool] = _mmr;
    }

    function setMinLoan(uint _minLoan,address _ammPool)external onlyDao(_ammPool){
        minLoan[_ammPool] = _minLoan;
    }

    function setMaxLoan(uint _maxLoan,address _ammPool)external onlyDao(_ammPool){
        maxLoan[_ammPool] = _maxLoan;
    }

    function setMinHoldingsReqPercentage(uint _minHoldingsReqPercentage,address _ammPool)external onlyDao(_ammPool){
        minHoldingsReqPercentage[_ammPool] = _minHoldingsReqPercentage;
    }

    function setLoanInterestRate(uint _loanInterestRate,address _ammPool)external onlyDao(_ammPool){
        loanInterestRate[_ammPool] = _loanInterestRate;
    }

    function setInterestPeriods(uint _interestPeriods,address _ammPool)external onlyDao(_ammPool){
        interestPeriods[_ammPool] = _interestPeriods;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Theseus Dao Functions////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setMinAndMaxInterestRate(uint _minInterestRate,uint _maxInterestRate)external onlyTheseus{
        require(_minInterestRate <= _maxInterestRate,'min interest rate is greater than max interest rate');
        minLoanInterestRateLimit = _minInterestRate;
        maxLoanInterestRateLimit = _maxInterestRate;
    }

    function setMinAndMaxLoan(uint _minLoan,uint _maxLoan)external onlyTheseus{
        require(_minLoan <= _maxLoan,'min loan is greater than max loan');
        minLoanLimit = _minLoan;
        maxLoanLimit = _maxLoan;
    }

    function setMinAndMaxMMR(uint _minMMR,uint _maxMMR)external onlyTheseus{
        require(_minMMR <= _maxMMR,'min MMR is greater than max MMR');
        minMMRLimit = _minMMR;
        maxMMRLimit = _maxMMR;
    }

    function setMinAndMaxMinHoldingsReqPercentage(uint _minMinHoldingsReqPercentage,uint _maxMinHoldingsReqPercentage)external onlyTheseus{
        require(_minMinHoldingsReqPercentage <= _maxMinHoldingsReqPercentage,'min min holdings req percentage is greater than max min holdings req percentage');
        minHoldingsReqPercentageLimit = _minMinHoldingsReqPercentage;
        maxHoldingsReqPercentageLimit = _maxMinHoldingsReqPercentage;
    }

}