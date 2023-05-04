// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";

// import "hardhat/console.sol";
contract Exchange is VaultMain {
    address public theseusDao;

    /**
 * @dev Constructor for initializing the Exchange contract
    @param _usdc The address of the USDC contract
     @param _staking The address of the staking contract
 * */
    constructor(
        address _usdc,
        address _staking,
        address _theseusDao
    ) VaultMain(_usdc, _staking) {
        theseusDao = _theseusDao;
    }

    //hello
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
        // require(!isFrozen[_amm], "");
        require(_side == 1 || _side == -1, "");
        require(_collateral > 0, "");
        require(_leverage > 0, "");
        require(isAmm[_amm], "Invalid AMM");

        require(
            availableBalance[msg.sender] >= _collateral,
            "Not enough balance"
        );
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
            _pool.borrow(_tradeId, _amm, _loanAmt, _collateral),
            "Borrow failed"
        );
        Position storage _position = positions[_tradeId];
        _position.collateral = _collateral;
        _position.loanedAmount = _loanAmt;
        _position.side = _side;
        _position.timeStamp = block.timestamp;
        _position.amm = _amm;
        _position.trader = msg.sender;
        (_position.positionSize, _position.entryPrice, ) = VAmm(_amm)
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

    function closeOutPosition(
        bytes memory _tradeId
    ) public returns (bool, int, uint) {
        Position storage _position = positions[_tradeId];
        require(isActive[_tradeId], "");
        require(msg.sender == _position.trader, "");
        require(payInterestPayments(_tradeId, _position.amm), "");
        // require(calcFFR(_tradeId,_position.amm), "close position failed");
        int _usdcAmt;
        uint _exitPrice;
        (_exitPrice, _usdcAmt) = VAmm(_position.amm).closePosition(
            _position.positionSize,
            _position.side
        );
        uint _loanAmount = tradeBalance[_tradeId];
        _usdcAmt -= int(_loanAmount);
        tradeBalance[_tradeId] = 0;
        require(
            LoanPool(loanPool).repayLoan(_tradeId, _loanAmount, _position.amm),
            "Repay loan failed"
        );
        _usdcAmt >= 0
            ? tradeCollateral[_tradeId] += uint(_usdcAmt)
            : tradeCollateral[_tradeId] -= uint(_usdcAmt * -1);
        availableBalance[msg.sender] += tradeCollateral[_tradeId];
        isActive[_tradeId] = false;
        _usdcAmt += int(tradeCollateral[_tradeId]);
        tradeCollateral[_tradeId] = 0;
        return (true, _usdcAmt, _exitPrice);
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
        require(isActive[_tradeId], "");
        Position storage _position = positions[_tradeId];
        require(msg.sender == _position.trader, "");
        require(_addedCollateral > 0, "");
        require(payInterestPayments(_tradeId, _position.amm), "");
        // require(calcFFR(_tradeId,_amm), "ffr payment failed");
        require(availableBalance[msg.sender] >= _addedCollateral, "");
        availableBalance[msg.sender] -= _addedCollateral;
        tradeCollateral[_tradeId] += _addedCollateral;
        uint _newLoan = _leverage * _addedCollateral;
        require(
            LoanPool(loanPool).borrow(
                _tradeId,
                _position.amm,
                _newLoan,
                tradeCollateral[_tradeId]
            ),
            "Borrow failed"
        );
        VAmm _amm = VAmm(_position.amm);
        (int additionalPositionSize, uint avgEntryPrice, ) = _amm.openPosition(
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
        require(isActive[_tradeId], "Trade not active");
        Position storage _position = positions[_tradeId];
        require(msg.sender == _position.trader, "No authorized");
        require(
            _positionSize * _position.side > 0 &&
                _positionSize * _position.side <
                _position.positionSize * _position.side,
            "P size invalid"
        );
        require(
            payInterestPayments(_tradeId, _position.amm),
            "Interest payment failed"
        );
        // require(calcFFR(_tradeId,_amm), "ffr payment failed");
        uint _loanAmount = _position.loanedAmount;
        VAmm _amm = VAmm(_position.amm);
        (, int _usdcAmt) = _amm.closePosition(_positionSize, _position.side);
        int _amountOwed = (((10 ** 8 * _positionSize) /
            _position.positionSize) * int(_loanAmount)) / (10 ** 8);
        int pnl = _usdcAmt - _amountOwed;
        if (pnl > 0) {
            availableBalance[msg.sender] += uint(pnl);
            poolTotalUsdcSupply[_position.amm] -= uint(pnl);
        } else {
            tradeCollateral[_tradeId] -= uint(pnl * -1);
        }
        LoanPool(loanPool).repayLoan(_tradeId, uint(_amountOwed), _position.amm);
        _position.positionSize -= _positionSize;
        _position.loanedAmount -= uint(_amountOwed);
        tradeBalance[_tradeId] -= uint(_amountOwed);
        return true;
    }

    /**
     *@dev Function to pay the funding rate for a position
     @param _tradeId The tradeId of the position
     @param _amm The address of the AMM contract
     @return A boolean value indicating whether the operation succeeded
     */
    function payFFR(
        bytes memory _tradeId,
        address _amm
    ) internal returns (bool) {
        int _ffrToBePayed = calcFFR(_tradeId, _amm);
        poolFFRFund[_amm] -= _ffrToBePayed;
        if (_ffrToBePayed > 0) {
            uint _ffrCal = uint(_ffrToBePayed);
            tradeCollateral[_tradeId] += _ffrCal;
            positions[_tradeId].collateral + _ffrCal;
            positions[_tradeId].lastFundingRate = block.timestamp;
        } else {
            uint _ffrCal = uint(_ffrToBePayed * -1);
            if (_ffrCal > tradeCollateral[_tradeId]) {
                liquidate(_tradeId);
            } else {
                tradeCollateral[_tradeId] -= _ffrCal;
                positions[_tradeId].collateral - _ffrCal;
                positions[_tradeId].lastFundingRate = block.timestamp;
            }
        }

        return true;
    }

    function calcFFR(
        bytes memory _tradeId,
        address _amm
    ) internal view returns (int) {
        // Position memory _position = positions[_tradeId];
        // VAmm _vamm = VAmm(_amm);
        int _ffr = 1;
        return _ffr;
    }

    //give array of liquidatable positions
    //liquidate function

    /**
     *@dev Function to get collateral and usdcAmt after closing position
     @param _tradeId The tradeId of the position
     @return _collateral The collateral after debit/credit of both interest owed and ffr
        @return _usdcAmt The usdc amount after closing position
     */
    function getValues(
        bytes memory _tradeId
    ) public view returns (uint _collateral, int _usdcAmt) {
        require(isActive[_tradeId], "Trade not active");
        LoanPool _pool = LoanPool(loanPool);
        address _ammPool = positions[_tradeId].amm;
        uint _interestOwed = _pool.interestOwed(_tradeId, _ammPool);
        int _ffrOwed = calcFFR(_tradeId, _ammPool);
        uint _collateral = positions[_tradeId].collateral;
        uint _collateralAfter = _ffrOwed > 0
            ? _collateral + uint(_ffrOwed) - _interestOwed
            : _collateral - uint(_ffrOwed * -1) - _interestOwed;
        VAmm _amm = VAmm(_ammPool);
        int _usdcAmt = _amm.getClosePosition(positions[_tradeId].positionSize);
    }

    /**
     *@dev Function to check if position can be liquidated
     @param _tradeId The tradeId of the position
     @return A boolean value indicating whether position can be liquidated
     */
    function checkLiquidiation(
        bytes memory _tradeId
    ) public view returns (bool) {
        (uint _collateralAfter, int _usdcAmt) = getValues(_tradeId);
        uint _mmr = LoanPool(loanPool).mmr(positions[_tradeId].amm);
        if (
            ((_collateralAfter - uint(_usdcAmt)) * 10 ** 8) /
                positions[_tradeId].loanedAmount >=
            _mmr
        ) {
            return false;
        } else {
            return true;
        }
    }

    /**
     *@dev Function to get pnl of a position
     @param _tradeId The tradeId of the position
     @return int The pnl of the position
     */
    function getPnl(bytes memory _tradeId) public view returns (int) {
        (uint _collateralAfter, int _usdcAmt) = getValues(_tradeId);
        return
            _usdcAmt +
            int(_collateralAfter) -
            int(positions[_tradeId].loanedAmount);
    }

    function checkLiquidiationList() public view returns (bytes[] memory) {
        bytes[] memory _liquidateList;
        uint _count = 0;
        for (uint i = 0; i < tradeIdList.length; i++) {
            if (checkLiquidiation(tradeIdList[i])) {
                _liquidateList[_count] = (tradeIdList[i]);
                _count++;
            }
        }
        return _liquidateList;
    }
}
