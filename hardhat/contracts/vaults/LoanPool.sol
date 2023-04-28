
// SPDX-License-Identifier: MIT
pragma soldity 0.8.17;
import "./Staking.sol";
contract LoanPool is Staking{

//mmr of 5% is 50000
    function borrow(bytes memory _tradeId, uint _totalCollateral, uint _loanAmount,address _ammPool)private returns(bool){
        require(_loanAmount >= minLoan[_ammPool],'below min loan');
        require(_loanAmount <= maxLoan[_ammPool],'above max loan');
        uint _minimumHoldings = poolAvailableUsdc[_ammPool]/minHoldingsReqPercentage;
        require(_loanAmount <= poolAvailableUsdc[_ammPool]-_minimumHoldings,'not enough available usdc');
        require(_totalCollateral*10**6 /_loanAmount >= mmr[_ammPool],'not enough collateral');
        borrowedAmount[_tradeId] += _loanAmount;
        poolOutstandingLoans[_ammPool] += _loanAmount;
        poolAvailableUsdc[_ammPool] -= _loanAmount;
        loanInterestLastPayed[_tradeId] = block.timestamp;
        interestForTrade[_tradeId] = loanInterestRate[_ammPool];
        return true;
    }

    function repayLoan(bytes memory _tradeId, uint _amount,address _ammPool)private returns(bool){
        require(_amount <= borrowedAmount[_tradeId],'repaying too much');
        require(interestOwed(_tradeId,_ammPool) ==0,'Need To pay interest first');
        borrowedAmount[_tradeId] -= _amount;
        poolOutstandingLoans[_ammPool] -= _amount;
        poolAvailableUsdc[_ammPool] += _amount;
        return true;
    }

    function addLeverage(bytes memory _tradeId, address _ammPool, uint _newLoan)private returns(bool){
        uint _totalLoan = _newLoan + borrowedAmount[_tradeId];
        require(interestOwed(_tradeId,_ammPool) ==0,'Need To pay interest first');
        require(_newLoan >= minLoan[_ammPool],'below min loan');
        require(_totalLoan <= maxLoan[_ammPool],'above max loan');
        uint _minimumHoldings = poolAvailableUsdc[_ammPool]/minHoldingsReqPercentage;
        require(_newLoan <= poolAvailableUsdc[_ammPool]-_minimumHoldings,'not enough available usdc');
        borrowedAmount[_tradeId] += _newLoan;
        poolOutstandingLoans[_ammPool] += _newLoan;
        poolAvailableUsdc[_ammPool] -= _newLoan;
        return true;
    }

    function interestOwed(bytes memory _tradeId,address _ammPool)public view returns(uint){
        uint _interest = interestForTrade[_tradeId];
        uint _interestPeriods = block.timestamp - loanInterestLastPayed[_tradeId]/interestPeriods[_ammPool];
        uint _interestToPay =  borrowedAmount[_tradeId]*( _interest * _timeSinceLastPayed)/(10**6) ;
        return _interestToPay;
    }

    function payInterest(bytes memory _tradeId,address _ammPool)private returns(bool){
        loanInterestLastPayed[_tradeId] = block.timestamp;
        return true;
    }

    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function setMMR(uint _mmr,address _ammPool)external onlyDao{
        mmr[_ammPool] = _mmr;
    }

    function setMinLoan(uint _minLoan,address _ammPool)external onlyDao{
        minLoan[_ammPool] = _minLoan;
    }

    function setMaxLoan(uint _maxLoan,address _ammPool)external onlyDao{
        maxLoan[_ammPool] = _maxLoan;
    }

    function setMinHoldingsReqPercentage(uint _minHoldingsReqPercentage,address _ammPool)external onlyDao{
        minHoldingsReqPercentage[_ammPool] = _minHoldingsReqPercentage;
    }

    function setLoanInterestRate(uint _loanInterestRate,address _ammPool)external onlyDao{
        loanInterestRate[_ammPool] = _loanInterestRate;
    }

    function setInterestPeriods(uint _interestPeriods,address _ammPool)external onlyDao{
        interestPeriods[_ammPool] = _interestPeriods;
    }



}