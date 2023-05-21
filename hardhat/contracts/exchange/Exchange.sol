// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";
import "./ExchangeViewer.sol";


contract Exchange is VaultMain {
  
    /**
 * @dev Constructor for initializing the Exchange contract
    @param _usdc The address of the USDC contract
     @param _staking The address of the staking contract
 * */
    constructor(
        address _usdc,
        address _staking
        
    ) VaultMain(_usdc, _staking,msg.sender) {
        
    }
    event NewPosition(
        bytes indexed tradeId,
        address indexed trader,
        address indexed amm,
        int side,
        uint timeStamp
    );
    event OpenPosition(
        bytes indexed tradeId,
        uint collateral,
        uint loanAmt,
        int positionSize,
        uint entryPrice,
        uint lastFundingRate
    );
    event AddLiquidity(
        bytes indexed tradeId,
        uint amount,
        uint newLoan,
        int addiotionalPositionSize
    );
    event RemoveLiquidity(
        bytes indexed tradeId,
        int positionSizeRemoved,
        int amountOwed,
        int usdcReturned
    );
    event ClosePosition(
        bytes indexed tradeId,
        uint closePrice,
        uint closeTime,
        int pnl
    );
    event Liquidated(
        bytes indexed tradeId
    );

    /** 
    * @dev Function to open a leveraged position
    * @param _amm The address of the AMM contract
    * @param _collateral The amount of collateral to deposit
    * @param _leverage The leverage to apply
    * @param _side The side of the trade (1 for long, -1 for short)
    @return A boolean value indicating whether the operation succeeded
    */
    function openPosition(address _amm, uint _collateral,uint _leverage,int _side) public returns (bool) {
        require(_side == 1 || _side == -1);
        require(_collateral > 0);
        require(_leverage > 0);
        require(isAmm[_amm]);

        require(
            availableBalance[msg.sender] >= _collateral);
        bytes memory _tradeId = abi.encodePacked(
            msg.sender,
            _amm,
            block.timestamp,
            _side
        );
        emit NewPosition(_tradeId, msg.sender, _amm, _side, block.timestamp);
        tradeIdList.push(_tradeId);
        LoanPool _pool=LoanPool(loanPool);
        uint _loanAmt = _collateral * _leverage;
        (uint _amtToPool, uint _amtToDao) = _pool.tradingFeeCalc(
            _amm,
            _loanAmt
        );
        availableBalance[msg.sender] -= (_collateral + _amtToPool + _amtToDao);
        tradeCollateral[_tradeId] += _collateral;
        tradeBalance[_tradeId] += _loanAmt;
        poolTotalUsdcSupply[_amm] += _amtToPool;
        poolAvailableUsdc[_amm] += _amtToPool;
        availableBalance[theseusDao] += _amtToDao;
        require(
            _pool.borrow(_tradeId, _amm, _loanAmt, _collateral));
        Position storage _position = positions[_tradeId];
        _position.collateral = _collateral;
        _position.loanedAmount = _loanAmt;
        _position.side = _side;
        _position.timeStamp = block.timestamp;
        _position.amm = _amm;
        _position.trader = msg.sender;
        (_position.positionSize, _position.entryPrice, ,_position.lastFundingRate) = VAmm(_amm)
            .openPosition(_loanAmt, _side);
        isActive[_tradeId] = true;
        tradeIds[msg.sender].push(_tradeId);
        emit OpenPosition(
            _tradeId,
            _collateral,
            _loanAmt,
            _position.positionSize,
            _position.entryPrice,
            _position.lastFundingRate
        );
        return true;
    }

    /**
     * @dev Function to close a position
     * @param _tradeId The tradeId of the position to close
     */
    function closeOutPosition(bytes memory _tradeId) public {
        Position memory _position = positions[_tradeId];
        _checkIfAuthorized(_tradeId, _position.trader);
        closePosition(_tradeId);
        tradeCollateral[_tradeId] =0;
        isActive[_tradeId] = false;
    }

    /**
     * @dev Function to add liquidity to position
     * @param _tradeId The tradeId of the position
     * @param _leverage The amount of leverage to add
     * @param _addedCollateral The amount of collateral to add
     * @return A boolean value indicating whether the operation succeeded
     **/
    function addLiquidityToPosition(bytes memory _tradeId,uint _leverage,uint _addedCollateral) public returns (bool) {
        Position storage _position = positions[_tradeId];
        _checkIfAuthorized(_tradeId, _position.trader);
        require(_addedCollateral > 0);
        _payments(_tradeId, _position.amm);
        require(availableBalance[msg.sender] >= _addedCollateral);
        availableBalance[msg.sender] -= _addedCollateral;
        tradeCollateral[_tradeId] += _addedCollateral;
        uint _newLoan = _leverage * _addedCollateral;
        require(
            LoanPool(loanPool).borrow(
                _tradeId,
                _position.amm,
                _newLoan,
                tradeCollateral[_tradeId]
            ));
        VAmm _amm = VAmm(_position.amm);
        (int additionalPositionSize, uint avgEntryPrice, ,) = _amm.openPosition(
            _newLoan,
            _position.side
        );
        _position.entryPrice = uint(
            (int(_position.entryPrice) *
                _position.positionSize +
                int(avgEntryPrice) *
                additionalPositionSize) /
                (_position.positionSize + additionalPositionSize)
        );
        _position.positionSize += additionalPositionSize;
        _position.loanedAmount += _newLoan;
        emit AddLiquidity(_tradeId, _addedCollateral, _newLoan, additionalPositionSize);
        return true;
    }
     /**
     * @dev Function to add liquidity to position
     * @param _tradeId The tradeId of the position
     * @param _positionSize The positionSize to remove
     * @return A boolean value indicating whether the operation succeeded
     **/
    function removeLiquidityFromPosition( bytes memory _tradeId,int _positionSize) public returns (bool) {
        Position storage _position = positions[_tradeId];
        _checkIfAuthorized(_tradeId, _position.trader);
        require(
            _positionSize * _position.side > 0 &&
                _positionSize * _position.side <
                _position.positionSize * _position.side);
        _payments(_tradeId, _position.amm);
        uint _loanAmount = _position.loanedAmount;
        VAmm _amm = VAmm(_position.amm);
        (, int _usdcAmt) = _amm.closePosition(_positionSize, _position.side);
        int _amountOwed = (((10 ** 8 * _positionSize) /
            _position.positionSize) * int(_loanAmount)) / (10 ** 8);
        int pnl = _usdcAmt - _amountOwed;
        if(pnl>0){
            checkPool(uint(pnl),_position.trader,_position.amm);
        }else{
            //check tradeCollateral > pnl else revert
            if(tradeCollateral[_tradeId]>uint(pnl)){
                tradeCollateral[_tradeId] -= uint(pnl * -1);
            }else{
                revert();
            } 
        }
        LoanPool(loanPool).repayLoan(_tradeId, uint(_amountOwed), _position.amm);
        _position.positionSize -= _positionSize;
        _position.loanedAmount -= uint(_amountOwed);
        tradeBalance[_tradeId] -= uint(_amountOwed);
        emit RemoveLiquidity(_tradeId, _positionSize, _amountOwed, _usdcAmt);
        return true;
    }
    function closePosition(bytes memory _tradeId)internal{
         Position memory _position = positions[_tradeId];
        (, uint _interest, int _ffr,,uint _loanAmount) = ExchangeViewer(exchangeViewer).getAllValues(_tradeId);
               int _usdcAmt;
               uint _closePrice;
          ( _closePrice, _usdcAmt) = VAmm(_position.amm).closePosition(_position.positionSize, _position.side);
        int _payment = _ffr + int(_interest);
        // poolOutstandingLoans[_position.amm] -= _loanAmount;
        tradeCollateral[_tradeId] += uint(_usdcAmt);
        uint _newTC = tradeCollateral[_tradeId];
        poolAvailableUsdc[_position.amm] += _newTC  - uint(_payment + int(_loanAmount));
        poolTotalUsdcSupply[_position.amm] += _newTC  - uint(_payment + int(_loanAmount));
        int(_newTC) >= _payment?_payments(_tradeId, _position.amm):();
        int(_newTC)-_payment>=int(_loanAmount)?_inTheMoney(_tradeId,_loanAmount,_position.amm,_position.trader,_newTC,_usdcAmt):_delinquent(_tradeId,_loanAmount,_position.amm);
        tradeCollateral[_tradeId] = 0;
         emit ClosePosition(_tradeId, _closePrice,block.timestamp, int(_newTC)- (_payment + int(_loanAmount)));
        tradeBalance[_tradeId] =0;
    }
    function _delinquent(bytes memory _tradeId, uint _loanAmt,address _amm)internal{
        uint _amtLeftOver = _loanAmt - tradeCollateral[_tradeId];
        LoanPool(loanPool).repayLoan(_tradeId, tradeCollateral[_tradeId], _amm);
        tradeCollateral[_tradeId] = 0;
        //amtLo debit from poolTotalUsdcSupply
        poolOutstandingLoans[_amm] -= _amtLeftOver;
        checkPool(_amtLeftOver,address(0),_amm);
    }
    function _inTheMoney(bytes memory _tradeId, uint _loanAmt,address _amm,address _user,uint _tradeCollateral,int _usdcAmt)internal{
        
        uint _amtLeftOver =  _tradeCollateral- _loanAmt;

        if(uint(_usdcAmt) >_loanAmt){
            uint _amtToPay = uint(_usdcAmt) - _loanAmt;
            poolAvailableUsdc[_amm] -= _amtToPay;
            poolTotalUsdcSupply[_amm] -= _amtToPay;
        }
        else{
            uint _amtToPay = _loanAmt - uint(_usdcAmt);
            poolAvailableUsdc[_amm] += _amtToPay;
            poolTotalUsdcSupply[_amm] += _amtToPay;
        }
        LoanPool(loanPool).repayLoan(_tradeId, _loanAmt, _amm);
        checkPool(_amtLeftOver,_user,_amm);
    }

    function checkPool(uint _amtLeftOver, address _user,address _amm)internal {
       if(poolTotalUsdcSupply[_amm]>=_amtLeftOver){
            if(address(_user) != address(0)){
                availableBalance[_user] += _amtLeftOver;
                if(poolAvailableUsdc[_amm]>=_amtLeftOver){
                    poolAvailableUsdc[_amm] -= _amtLeftOver;
                    poolTotalUsdcSupply[_amm] -= _amtLeftOver;
                }else{
                    //debt
                   _intoDebt(_amtLeftOver,_amm);
                }
            }else{
                poolTotalUsdcSupply[_amm] -= _amtLeftOver;    
            }
        }else{
            //debt
            _intoDebt(_amtLeftOver,_amm);
        }
    }
    function _intoDebt(uint _amtLeftOver, address _amm)internal{
        uint _remaining = _amtLeftOver - poolAvailableUsdc[_amm];
        poolAvailableUsdc[_amm] = 0;
        poolTotalUsdcSupply[_amm] = poolOutstandingLoans[_amm];
        LoanPool(loanPool).addDebt(_remaining,_amm);
        freezeStaking(_amm);
        availableBalance[theseusDao]-=_remaining;
    }

     function liquidate(bytes memory _tradeId) public {
        require(ExchangeViewer(exchangeViewer).checkLiquidiation(_tradeId));
        closePosition(_tradeId);
        emit Liquidated(_tradeId);
    } 

    function freezeStaking(address _amm)internal {
        Staking(staking).freeze(_amm);
    }
    function unFreezeStaking(address _amm)public onlyPool {
        Staking(staking).unFreeze(_amm);
    }
}