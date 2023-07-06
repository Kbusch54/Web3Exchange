// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";
import "./ExchangeViewer.sol";


contract Exchange is VaultMain {
    using ExchangeLibrary for *;
  
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
        address indexed trader,
        address indexed amm,
        int side,
        uint timeStamp
    );
    event OpenPosition(
        address indexed trader,
        uint timestamp,
        uint collateral,
        uint loanAmt,
        int positionSize,
        uint entryPrice,
        uint lastFundingRate
    );
    event AddLiquidity(
        address indexed trader,
        uint timestamp,
        uint amount,
        uint newLoan,
        int addiotionalPositionSize
    );
    event RemoveLiquidity(
        address indexed trader,
        uint timestamp,
        int positionSizeRemoved,
        int amountOwed,
        int usdcReturned
    );
    event ClosePosition(
        address indexed trader,
        uint timestamp,
        uint closePrice,
        uint closeTime,
        int pnl
    );
    event Liquidated(
        address indexed trader,
        uint timestamp
    );

    /** 
    * @dev Function to open a leveraged position
    * @param _amm The address of the AMM contract
    * @param _collateral The amount of collateral to deposit
    * @param _leverage The leverage to apply
    * @param _side The side of the trade (1 for long, -1 for short)
    @return A boolean value indicating whether the operation succeeded
    */
    function openPosition(address _amm, uint _collateral,uint _leverage,int _side,bytes calldata _payload) public returns (bool) {
       ExchangeLibrary.validateOpenPosition(_side, _collateral,_leverage, _amm, msg.sender,availableBalance, isAmm);
        bytes memory _tradeId = abi.encode(
            msg.sender,
            _amm,
            block.timestamp,
            _side
        );
        emit NewPosition( msg.sender, _amm, _side, block.timestamp);
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
        _pool.borrow(_tradeId, _amm, _loanAmt, _collateral);
        Position storage _position = positions[_tradeId];
        _position.collateral = _collateral;
        _position.loanedAmount = _loanAmt;
        _position.side = _side;
        _position.timeStamp = block.timestamp;
        _position.amm = _amm;
        _position.trader = msg.sender;
        (_position.positionSize, _position.entryPrice, ,_position.lastFundingRate) = VAmm(_amm)
            .openPosition(_loanAmt, _side,_payload);
        isActive[_tradeId] = true;
        tradeIds[msg.sender].push(_tradeId);
        emit OpenPosition(
            msg.sender,block.timestamp,
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
    function closeOutPosition(bytes memory _tradeId,bytes calldata _payload) public {
         _checkAuthorization(_tradeId);
        closePosition(_tradeId,_payload);
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
    function addLiquidityToPosition(bytes memory _tradeId,uint _leverage,uint _addedCollateral,bytes calldata _payload) public returns (bool) {
       Position storage _position = positions[_tradeId];
         _checkAuthorization(_tradeId);
                (,,uint _timeStamp,) = decodeTradeId(_tradeId);
        _payments(_tradeId, _position.amm);
        require(_addedCollateral > 0);
        require(availableBalance[msg.sender] >= _addedCollateral);
        availableBalance[msg.sender] -= _addedCollateral;
        tradeCollateral[_tradeId] += _addedCollateral;
        uint _newLoan = _leverage * _addedCollateral;

            LoanPool(loanPool).borrow(_tradeId,_position.amm,_newLoan,tradeCollateral[_tradeId]);
        VAmm _amm = VAmm(_position.amm);
        (int additionalPositionSize, uint avgEntryPrice, ,) = _amm.openPosition(
            _newLoan,
            _position.side,
            _payload
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
        emit AddLiquidity(msg.sender,_timeStamp, _addedCollateral, _newLoan, additionalPositionSize);
        return true;
    }
     /**
     * @dev Function to add liquidity to position
     * @param _tradeId The tradeId of the position
     * @param _positionSize The positionSize to remove
     * @return A boolean value indicating whether the operation succeeded
     **/
    function removeLiquidityFromPosition( bytes memory _tradeId,int _positionSize,bytes calldata _payload) public returns (bool) {
        Position storage _position = positions[_tradeId];
         _checkAuthorization(_tradeId);
        require(
            _positionSize * _position.side > 0 &&
                _positionSize * _position.side <
                _position.positionSize * _position.side);
        _payments(_tradeId, _position.amm);
        uint _loanAmount = _position.loanedAmount;
        VAmm _amm = VAmm(_position.amm);
        (, int _usdcAmt) = _amm.closePosition(_positionSize, _position.side,_payload);
        int _amountOwed = (((10 ** 8 * _positionSize) /
            _position.positionSize) * int(_loanAmount)) / (10 ** 8);
        int pnl = _usdcAmt - _amountOwed;
        if(pnl>0){
            checkPool(uint(pnl),_position.trader,_position.amm);
        }else{
            //check tradeCollateral > pnl else revert
            if(tradeCollateral[_tradeId]>=uint(pnl)){
                tradeCollateral[_tradeId] -= uint(pnl * -1);
            }else{
                revert();
            } 
        }
        LoanPool(loanPool).repayLoan(_tradeId, uint(_amountOwed), _position.amm);
        _position.positionSize -= _positionSize;
        _position.loanedAmount -= uint(_amountOwed);
        tradeBalance[_tradeId] -= uint(_amountOwed);
        (address _trader,,uint _timeStamp,)=decodeTradeId(_tradeId);
        emit RemoveLiquidity(_trader,_timeStamp, _positionSize, _amountOwed, _usdcAmt);
        return true;
    }
    function closePosition(bytes memory _tradeId,bytes calldata _payload)internal{
         Position memory _position = positions[_tradeId];
        (, uint _interest, int _ffr,,uint _loanAmount) = ExchangeViewer(exchangeViewer).getAllValues(_tradeId);
               int _usdcAmt;
               uint _closePrice;
          ( _closePrice, _usdcAmt) = VAmm(_position.amm).closePosition(_position.positionSize, _position.side,_payload);
        int _payment = _ffr + int(_interest);
        // poolOutstandingLoans[_position.amm] -= _loanAmount;
        tradeCollateral[_tradeId] += uint(_usdcAmt);
        uint _newTC = tradeCollateral[_tradeId];
        poolAvailableUsdc[_position.amm] += _newTC  - uint(_payment + int(_loanAmount));
        poolTotalUsdcSupply[_position.amm] += _newTC  - uint(_payment + int(_loanAmount));
        int(_newTC) >= _payment?_payments(_tradeId, _position.amm):();
        int(tradeCollateral[_tradeId])-_payment>=int(_loanAmount)?_inTheMoney(_tradeId,_loanAmount,_position.amm,_position.trader,tradeCollateral[_tradeId],_usdcAmt):_delinquent(_tradeId,_loanAmount,_position.amm);
        tradeCollateral[_tradeId] = 0;
         emit ClosePosition(_position.trader,_position.timeStamp, _closePrice,block.timestamp, int(tradeCollateral[_tradeId])- (_payment + int(_loanAmount)));
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

     function liquidate(bytes memory _tradeId,bytes calldata _payload) public {
        require(ExchangeViewer(exchangeViewer).checkLiquidiation(_tradeId));
        closePosition(_tradeId,_payload);
        (address _trader,,uint _timeStamp,) = decodeTradeId(_tradeId);
        isActive[_tradeId] = false;
        emit Liquidated(_trader,_timeStamp);
    } 

    function freezeStaking(address _amm)internal {
        Staking(staking).freeze(_amm);
    }
    function unFreezeStaking(address _amm)public onlyPool {
        Staking(staking).unFreeze(_amm);
    }
}