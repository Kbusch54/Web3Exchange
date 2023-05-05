// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";
import "./ExchangeViewer.sol";

// import "hardhat/console.sol";
contract Exchange is VaultMain {
    


    /**
 * @dev Constructor for initializing the Exchange contract
    @param _usdc The address of the USDC contract
     @param _staking The address of the staking contract
        @param _theseusDao The address of the TheseusDao contract
 * */
    constructor(
        address _usdc,
        address _staking,
        address _theseusDao
    ) VaultMain(_usdc, _staking,_theseusDao) {
        
    }

    /** 
* @dev Function to open a leveraged position
* @param _amm The address of the AMM contract
* @param _collateral The amount of collateral to deposit
* @param _leverage The leverage to apply
* @param _side The side of the trade (1 for long, -1 for short)
@return A boolean value indicating whether the operation succeeded
*/
    function openPosition(
        address _amm,
        uint _collateral,
        uint _leverage,
        int _side
    ) public returns (bool) {
        // require(!isFrozen[_amm]);
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
        return true;
    }

    /**
     * @dev Function to close a position
     * @param _tradeId The tradeId of the position to close
     * @return A tuple containing the following values:
     *    - A boolean value indicating whether the operation succeeded
     *    - The USDC amount returned to the user
     *    - The exit price of the position
     */

// TODO: check for not enough usdc
    function closeOutPosition(
        bytes memory _tradeId
    ) public returns (bool, int,uint) {
        Position memory _position = positions[_tradeId];
        require(isActive[_tradeId]);
        require(msg.sender == _position.trader || msg.sender == address(this));
        console.log("closeOutPosition");
        (int _usdcAmt,uint _totalAmount) = closePosition(_tradeId);
        tradeCollateral[_tradeId] =0;
        isActive[_tradeId] = false;
        return (true,_usdcAmt,_totalAmount);
    }

    /**
     * @dev Function to add liquidity to position
     * @param _tradeId The tradeId of the position
     * @param _leverage The amount of leverage to add
     * @param _addedCollateral The amount of collateral to add
     * @return A boolean value indicating whether the operation succeeded
     * @notice This function is not implemented yet
     **/
    function addLiquidityToPosition(
        bytes memory _tradeId,
        uint _leverage,
        uint _addedCollateral
    ) public returns (bool) {
        require(isActive[_tradeId]);
        Position storage _position = positions[_tradeId];
        require(msg.sender == _position.trader);
        require(_addedCollateral > 0);
        require(payInterestPayments(_tradeId, _position.amm));
        require(payFFR(_tradeId,_position.amm));
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
        return true;
    }

    function removeLiquidityFromPosition(
        bytes memory _tradeId,
        int _positionSize
    ) public returns (bool) {
        require(isActive[_tradeId]);
        Position storage _position = positions[_tradeId];
        require(msg.sender == _position.trader);
        require(
            _positionSize * _position.side > 0 &&
                _positionSize * _position.side <
                _position.positionSize * _position.side);
        require(payInterestPayments(_tradeId, _position.amm));
        require(payFFR(_tradeId,_position.amm));
        uint _loanAmount = _position.loanedAmount;
        VAmm _amm = VAmm(_position.amm);
        (, int _usdcAmt) = _amm.closePosition(_positionSize, _position.side);
        int _amountOwed = (((10 ** 8 * _positionSize) /
            _position.positionSize) * int(_loanAmount)) / (10 ** 8);
        int pnl = _usdcAmt - _amountOwed;
        pnl > 0?checkPoolUsdc( uint(pnl),  _position.trader,_position.amm):tradeCollateral[_tradeId] -= uint(pnl * -1);
        LoanPool(loanPool).repayLoan(_tradeId, uint(_amountOwed), _position.amm);
        _position.positionSize -= _positionSize;
        _position.loanedAmount -= uint(_amountOwed);
        tradeBalance[_tradeId] -= uint(_amountOwed);
        return true;
    }
    function closePosition(bytes memory _tradeId)internal returns(int,uint){
         Position memory _position = positions[_tradeId];
        (uint _collateral, uint _interest, int _ffr,,uint _loanAmount) = ExchangeViewer(exchangeViewer).getAllValues(_tradeId);
               int _usdcAmt;
          (, _usdcAmt) = VAmm(_position.amm).closePosition(_position.positionSize, _position.side);
        int _payment = _ffr + int(_interest);
        poolOutstandingLoans[_position.amm] -= _loanAmount;
        uint _totalAmount;
        tradeCollateral[_tradeId] += uint(_usdcAmt);
        if(int(_collateral)+_usdcAmt>= _payment + int(_loanAmount)){
            require(payInterestPayments(_tradeId, _position.amm));
            require(payFFR(_tradeId,_position.amm));
            require(LoanPool(loanPool).repayLoan(_tradeId, _loanAmount, _position.amm));
            uint _amountToPay = uint(_usdcAmt)+_collateral- _loanAmount;
            _totalAmount = checkPoolUsdc( _amountToPay,_position.trader,_position.amm);
        }else if(int(_collateral)+_usdcAmt>= _payment){
            require(payInterestPayments(_tradeId, _position.amm));
            require(payFFR(_tradeId,_position.amm));
            uint _remaining =_loanAmount - tradeCollateral[_tradeId];
            require(LoanPool(loanPool).repayLoan(_tradeId, _remaining, _position.amm));
            _totalAmount = checkPoolUsdc( _remaining,address(0),_position.amm);
        }else{
            require(LoanPool(loanPool).repayLoan(_tradeId, uint(_usdcAmt), _position.amm));
            uint _amountToPay = _loanAmount>tradeCollateral[_tradeId]? _loanAmount -tradeCollateral[_tradeId]:tradeCollateral[_tradeId]-_loanAmount;
            _totalAmount = checkPoolUsdc( _amountToPay,address(0),_position.amm);
        }
        tradeCollateral[_tradeId] =0;
        tradeBalance[_tradeId] =0;
        return (_usdcAmt,_totalAmount);
    }

 function checkPoolUsdc(uint _amount, address _user,address _amm)internal returns(uint) {
        if(poolAvailableUsdc[_amm]>=_amount){
            poolAvailableUsdc[_amm] -= _amount;
            poolTotalUsdcSupply[_amm] -= _amount;
            if(_user != address(0)){
                availableBalance[_user] += _amount;
            }
        }else{
            uint _remaining = _amount - poolAvailableUsdc[_amm];
            poolAvailableUsdc[_amm] = 0;
            poolTotalUsdcSupply[_amm] = poolOutstandingLoans[_amm];
            LoanPool(loanPool).addDebt(_remaining,_amm);
            availableBalance[theseusDao]-=_remaining;
            if(_user != address(0)){
                availableBalance[_user] += _amount;
            }
        }
            return _amount;
    }
   
   function liquidate(bytes memory _tradeId) public {
        (
            address _user,
            address _amm,
            ,
        ) = decodeTradeId(_tradeId);
        require(ExchangeViewer(exchangeViewer).checkLiquidiation(_tradeId));
        closePosition(_tradeId);
    } 

    function freezeStaking(address _amm)public {
    
        Staking(staking).freeze(_amm);
    }
  
}
