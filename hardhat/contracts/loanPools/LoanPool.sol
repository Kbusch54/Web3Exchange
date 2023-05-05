// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./LoanPoolBalances.sol";
import "../exchange/Balances.sol";
import "../exchange/Exchange.sol";
import "../../node_modules/hardhat/console.sol";


/**
 * @title LoanPool
 * @dev A contract for managing a loan pool with staking functionality.
 */
contract LoanPool is  LoanPoolBalances{


address public exchange;
    modifier onlyDao(address _ammPool){
        require(msg.sender == dao[_ammPool],'not dao');
        _;
    }
    modifier onlyTheseus {
        require(msg.sender == theseusDao,'not theseus');
        _;
    }
    modifier onlyTheseusOrDao(address _ammPool){
        require(msg.sender == theseusDao || msg.sender == dao[_ammPool],'not theseus or dao');
        _;
    }
   
    modifier onlyExchange {
        require(msg.sender == exchange,'not exchange');
        _;
    }

    constructor(address _exchange)  {
        exchange = _exchange;

    }


   /**
     * @dev Function for repaying a loan.
     * @param _tradeId The unique identifier for the trade.
     * @param _amount The amount to repay.
     * @param _ammPool The address of the AMM pool.
     * @return true if the repayment is successful, otherwise false.
     */
    function repayLoan(bytes memory _tradeId, uint _amount,address _ammPool)external onlyExchange returns(bool){
        require(_amount <= borrowedAmount[_tradeId],'repaying too much');
        (uint _full,)=interestOwed(_tradeId,_ammPool);
        require( _full==0,'Need To pay interest first');
        borrowedAmount[_tradeId] -= _amount;
        // Exchange _ex = Exchange(exchange);
        // _ex.subPoolOutstandingLoans(_ammPool,_amount);
        // _ex.addPoolAvailableUsdc(_ammPool,_amount);
        return true;
    }

    /**
     * @dev Function for borrowing to a trade.
     * @param _tradeId The unique identifier for the trade.
     * @param _ammPool The address of the AMM pool.
     * @param _newLoan The new loan amount to add.
     * @return true if the operation is successful, otherwise false.
     */
    function borrow(bytes memory _tradeId, address _ammPool, uint _newLoan,uint _tradeCollateral)external onlyExchange returns(bool){
        uint _totalLoan = _newLoan + borrowedAmount[_tradeId];
        require(_newLoan >= minLoan[_ammPool],'Loan must be above minimum');
        require(_totalLoan <= maxLoan[_ammPool],'Loan is too large');
        Exchange _ex = Exchange(exchange);
        uint _poolAvail = _ex.poolAvailableUsdc(_ammPool);
        uint _minimumHoldings = _poolAvail/minHoldingsReqPercentage[_ammPool];
        require(_newLoan <= _poolAvail-_minimumHoldings,'Not enough available');
        require(_tradeCollateral*10**6 /_totalLoan >= mmr[_ammPool],'Not enough collateral');
        borrowedAmount[_tradeId] += _newLoan;
        _ex.addPoolOutstandingLoans(_ammPool,_newLoan);
        _ex.subPoolAvailableUsdc(_ammPool,_newLoan);
        loanInterestLastPayed[_tradeId] = block.timestamp;
        interestForTrade[_tradeId] = loanInterestRate[_ammPool];
        return true;
    }
      /**
     * @dev Function for calculating the interest owed for a trade.
     * @param _tradeId The unique identifier for the trade.
     * @param _ammPool The address of the AMM pool.
     * @return _totalInterest The interest owed for the trade.
     * @return _toPools The interest owed to the pools.
     */

    function interestOwed(bytes memory _tradeId,address _ammPool)public view returns(uint _totalInterest,uint _toPools){
        uint _interest = interestForTrade[_tradeId]; 
        uint _interestPeriods = (block.timestamp - loanInterestLastPayed[_tradeId])/interestPeriods[_ammPool];
        _totalInterest =  (borrowedAmount[_tradeId]*( _interest * _interestPeriods))/(10**6) ;
        if(debt[_ammPool] == 0){
            return (_totalInterest,_totalInterest);
        }else{
            _toPools = _totalInterest/2;
        return (_totalInterest,_toPools);
        }

    }

    /**
     * @dev Function for paying the interest for a trade.
     * @param _tradeId The unique identifier for the trade.
     * @return true if the interest payment is successful, otherwise false.
     */
    function payInterest(bytes memory _tradeId)external onlyExchange returns(bool){
        loanInterestLastPayed[_tradeId] = block.timestamp;
        return true;
    }

    /**
     * @dev Function for calculating the trading fee for a trade.
     * @param _amm The address of the AMM pool.
     * @param _loanAmt The amount of the loan.
     * @return feeToPool The fee to the pool.
     * @return feeToDAO The fee to the DAO.
     */
    function tradingFeeCalc(address _amm, uint _loanAmt)external onlyExchange returns(uint feeToPool,uint feeToDAO){
        uint _tradingFee = tradingFeeLoanPool[_amm];
        uint _fee = (_loanAmt * _tradingFee)/10**6;
        if(debt[_amm] == 0){
            _fee/=2;
            return (_fee,_fee);
        }
        debt[_amm] -= _fee;
        return (0,_fee);
    }

    function subDebt(uint _amount,address _ammPool)external onlyExchange{
        debt[_ammPool] -= _amount;
    }
    function addDebt(uint _amount,address _ammPool)external onlyExchange{
        debt[_ammPool] += _amount;
    }

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
TODO:Require min and max
*/
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
    function setTradingFee(uint _tradingFee,address _ammPool)external onlyDao(_ammPool){
        tradingFeeLoanPool[_ammPool] = _tradingFee;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Theseus Dao Functions////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setMinAndMaxInterestRate(uint _minInterestRate,uint _maxInterestRate)external onlyTheseus{
        require(_minInterestRate <= _maxInterestRate,'');
        minLoanInterestRateLimit = _minInterestRate;
        maxLoanInterestRateLimit = _maxInterestRate;
    }

    function setMinAndMaxLoan(uint _minLoan,uint _maxLoan)external onlyTheseus{
        require(_minLoan <= _maxLoan,'');
        minLoanLimit = _minLoan;
        maxLoanLimit = _maxLoan;
    }

    function setMinAndMaxMMR(uint _minMMR,uint _maxMMR)external onlyTheseus{
        require(_minMMR <= _maxMMR,'');
        minMMRLimit = _minMMR;
        maxMMRLimit = _maxMMR;
    }

    function setMinAndMaxMinHoldingsReqPercentage(uint _minMinHoldingsReqPercentage,uint _maxMinHoldingsReqPercentage)external onlyTheseus{
        require(_minMinHoldingsReqPercentage <= _maxMinHoldingsReqPercentage,'');
        minHoldingsReqPercentageLimit = _minMinHoldingsReqPercentage;
        maxHoldingsReqPercentageLimit = _maxMinHoldingsReqPercentage;
    }
    function setMinAndMaxTradingFee(uint _minTradingFee,uint _maxTradingFee)external onlyTheseus{
        require(_minTradingFee <= _maxTradingFee,'');
        minTradingFeeLimit = _minTradingFee;
        maxTradingFeeLimit = _maxTradingFee;
    }

    
    /**
     * @dev Function to initialize a new AMM
     *  @param _amm The address of the AMM contract
     */
    function initializeVamm(address _amm) public {
        // require(!isFrozen[_amm], "amm already initialized");
        maxLoan[_amm] = 1000000000;
        minLoan[_amm] = 1000000;
        loanInterestRate[_amm] = 10000;
        interestPeriods[_amm] = 2 hours;
        mmr[_amm] = 50000;
        minHoldingsReqPercentage[_amm] = 20000;
        tradingFeeLoanPool[_amm] = 10000;
    }

}