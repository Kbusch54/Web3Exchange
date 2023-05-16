// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./LoanPoolBalances.sol";
import "../exchange/Balances.sol";
import "../exchange/Exchange.sol";


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
        theseusDao = msg.sender;
        

    }

    function setTheseusDao(address _theseusDao) external onlyTheseus{
        theseusDao = _theseusDao;
    }



    event LoanPoolInitialized(address indexed _ammPool, address indexed _dao,uint timeStamp);
    event LoanPoolValues(address indexed ammPool, uint minLoan, uint maxLoan, uint loanInterestRate, uint loanInterestPeriod, uint mmr, uint minHoldingsReqPercentage, uint tradingFee);

//DAO functions for values events
    event MMRSet(uint _mmr,address indexed _ammPool);
    event MinLoanSet(uint _minLoan,address indexed _ammPool);
    event MaxLoanSet(uint _maxLoan,address indexed _ammPool);
    event MinHoldingsReqPercentageSet(uint _minHoldingsReqPercentage,address indexed _ammPool);
    event LoanInterestRateSet(uint _loanInterestRate,address indexed _ammPool);
    event InterestPeriodsSet(uint _interestPeriods,address indexed _ammPool);
    event TradingFeeSet(uint _tradingFee,address indexed _ammPool);
//Theseus events for min and maximums
    event MinAndMaxInterestRateSet(uint _minInterestRate,uint _maxInterestRate);
    event MinAndMaxLoanSet(uint _minLoan,uint _maxLoan);
    event MinAndMaxMMRSet(uint _minMMR,uint _maxMMR);
    event MinAndMaxHoldingsReqPercentageSet(uint _minHoldingsReqPercentage,uint _maxHoldingsReqPercentage);
    event MinAndMaxTradingFeeSet(uint _minTradingFee,uint _maxTradingFee);
    event MinAndMaxInterestPeriodsSet(uint _minInterestPeriods,uint _maxInterestPeriods);

    //Balances Events
    event PayDebt(address indexed amm, uint amount);
    event AddDebt(address indexed amm, uint amount);
    event PayInterest(bytes tradeId, uint lastPayed);
    event BorrowAmount(bytes tradeId,address indexed amm, uint amount);
    event RepayLoan(bytes tradeId,address indexed amm, uint amount);

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
        emit RepayLoan(_tradeId,_ammPool,_amount);
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
        emit BorrowAmount(_tradeId,_ammPool,_newLoan); 
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
        emit PayInterest(_tradeId,block.timestamp);
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
        emit PayDebt(_amm,_fee);
        return (0,_fee);
    }

    function subDebt(uint _amount,address _ammPool)external onlyExchange{
        debt[_ammPool]<_amount?debt[_ammPool]=0:debt[_ammPool] -= _amount;
        if(debt[_ammPool] == 0){
            Exchange(exchange).unFreezeStaking(_ammPool);
        }
        emit PayDebt(_ammPool,_amount);
    }
    function addDebt(uint _amount,address _ammPool)external onlyExchange{
        debt[_ammPool] += _amount;
        emit AddDebt(_ammPool,_amount);
    }

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function setMMR(uint _mmr,address _ammPool)external onlyDao(_ammPool){
        require(_mmr >=minMMRLimit && _mmr <= maxMMRLimit,'MMR out of range');
        mmr[_ammPool] = _mmr;
        emit MMRSet(_mmr,_ammPool);
    }

    function setMinLoan(uint _minLoan,address _ammPool)external onlyDao(_ammPool){
        require(_minLoan >=minLoanLimit && _minLoan <= maxLoanLimit && _minLoan < maxLoan[_ammPool],'Min Loan out of range');
        minLoan[_ammPool] = _minLoan;
        emit MinLoanSet(_minLoan,_ammPool);
    }

    function setMaxLoan(uint _maxLoan,address _ammPool)external onlyDao(_ammPool){
        require(_maxLoan >=minLoanLimit && _maxLoan <= maxLoanLimit && _maxLoan > minLoan[_ammPool],'Max Loan out of range');
        maxLoan[_ammPool] = _maxLoan;
        emit MaxLoanSet(_maxLoan,_ammPool);
    }

    function setMinHoldingsReqPercentage(uint _minHoldingsReqPercentage,address _ammPool)external onlyDao(_ammPool){
        require(_minHoldingsReqPercentage >=minHoldingsReqPercentageLimit && _minHoldingsReqPercentage <= maxHoldingsReqPercentageLimit,'Min Holdings Req Percentage out of range');
        minHoldingsReqPercentage[_ammPool] = _minHoldingsReqPercentage;
        emit MinHoldingsReqPercentageSet(_minHoldingsReqPercentage,_ammPool);
    }

    function setLoanInterestRate(uint _loanInterestRate,address _ammPool)external onlyDao(_ammPool){
        require(_loanInterestRate >=minLoanInterestRateLimit && _loanInterestRate <= maxLoanInterestRateLimit,'Loan Interest Rate out of range');
        loanInterestRate[_ammPool] = _loanInterestRate;
        emit LoanInterestRateSet(_loanInterestRate,_ammPool);
    }

    function setInterestPeriods(uint _interestPeriods,address _ammPool)external onlyDao(_ammPool){
        require(_interestPeriods >=minInterestPeriodsLimit && _interestPeriods <= maxInterestPeriodsLimit,'Interest Periods out of range');
        interestPeriods[_ammPool] = _interestPeriods;
        emit InterestPeriodsSet(_interestPeriods,_ammPool);
    }
    function setTradingFee(uint _tradingFee,address _ammPool)external onlyDao(_ammPool){
        require(_tradingFee >=minTradingFeeLimit && _tradingFee <= maxTradingFeeLimit,'Trading Fee out of range');
        tradingFeeLoanPool[_ammPool] = _tradingFee;
        emit TradingFeeSet(_tradingFee,_ammPool);
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Theseus Dao Functions////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setMinAndMaxInterestRate(uint _minInterestRate,uint _maxInterestRate)external onlyTheseus{
        require(_minInterestRate <= _maxInterestRate,'');
        minLoanInterestRateLimit = _minInterestRate;
        maxLoanInterestRateLimit = _maxInterestRate;
        emit MinAndMaxInterestRateSet(_minInterestRate,_maxInterestRate);
    }

    function setMinAndMaxLoan(uint _minLoan,uint _maxLoan)external onlyTheseus{
        require(_minLoan <= _maxLoan,'');
        minLoanLimit = _minLoan;
        maxLoanLimit = _maxLoan;
        emit MinAndMaxLoanSet(_minLoan,_maxLoan);
    }

    function setMinAndMaxMMR(uint _minMMR,uint _maxMMR)external onlyTheseus{
        require(_minMMR <= _maxMMR,'');
        minMMRLimit = _minMMR;
        maxMMRLimit = _maxMMR;
        emit MinAndMaxMMRSet(_minMMR,_maxMMR);
    }

    function setMinAndMaxMinHoldingsReqPercentage(uint _minMinHoldingsReqPercentage,uint _maxMinHoldingsReqPercentage)external onlyTheseus{
        require(_minMinHoldingsReqPercentage <= _maxMinHoldingsReqPercentage,'');
        minHoldingsReqPercentageLimit = _minMinHoldingsReqPercentage;
        maxHoldingsReqPercentageLimit = _maxMinHoldingsReqPercentage;
        emit MinAndMaxHoldingsReqPercentageSet(_minMinHoldingsReqPercentage,_maxMinHoldingsReqPercentage);
    }
    function setMinAndMaxTradingFee(uint _minTradingFee,uint _maxTradingFee)external onlyTheseus{
        require(_minTradingFee <= _maxTradingFee,'');
        minTradingFeeLimit = _minTradingFee;
        maxTradingFeeLimit = _maxTradingFee;
        emit MinAndMaxTradingFeeSet(_minTradingFee,_maxTradingFee);
    }
    function setMinAndMaxInterestPeriods(uint _minInterestPeriods,uint _maxInterestPeriods)external onlyTheseus{
        require(_minInterestPeriods <= _maxInterestPeriods,'');
        minInterestPeriodsLimit = _minInterestPeriods;
        maxInterestPeriodsLimit = _maxInterestPeriods;
        emit MinAndMaxInterestPeriodsSet(_minInterestPeriods,_maxInterestPeriods);
    }

    
    /**
     * @dev Function to initialize a new AMM
     *  @param _amm The address of the AMM contract
     * @param _ariadneDao The address of the DAO contract
     */
    function initializeVamm(address _amm,address _ariadneDao) public onlyTheseus {
        // require(!isFrozen[_amm], "amm already initialized");
        maxLoan[_amm] = maxLoanLimit;
        minLoan[_amm] = minLoanLimit;
        loanInterestRate[_amm] = minLoanInterestRateLimit;
        interestPeriods[_amm] = minInterestPeriodsLimit;
        mmr[_amm] = minMMRLimit;
        minHoldingsReqPercentage[_amm] = maxHoldingsReqPercentageLimit;
        tradingFeeLoanPool[_amm] = minTradingFeeLimit;
        dao[_amm] = _ariadneDao;
        emit LoanPoolInitialized(_amm,_ariadneDao,block.timestamp);
        emit LoanPoolValues(_amm,minLoanLimit,maxLoanLimit,minLoanInterestRateLimit,minInterestPeriodsLimit,maxMMRLimit,maxHoldingsReqPercentageLimit,maxTradingFeeLimit);
    }

}