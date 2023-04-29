// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";

contract Exchange is VaultMain {
    /**
 * @dev Constructor for initializing the Exchange contract
    @param _usdc The address of the USDC contract
     @param _staking The address of the staking contract
 * */
    constructor(
        address _usdc,
        address _staking
    ) VaultMain(_usdc, _staking) {}

    
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

        require(
            availableBalance[msg.sender] >= _collateral,
            ""
        );
        bytes memory _tradeId = abi.encodePacked(
            msg.sender,
            _amm,
            block.timestamp,
            _side
        );
        uint _loanAmt = _collateral * _leverage;
        availableBalance[msg.sender] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        tradeBalance[_tradeId] += _loanAmt;
        require(borrow(_tradeId,  _amm,_loanAmt), "");
        Position storage _position = positions[_tradeId];
        _position.collateral = _collateral;
        _position.loanedAmount = _loanAmt;
        _position.side = _side;
        _position.timeStamp = block.timestamp;
        _position.amm = _amm;
        _position.trader = msg.sender;
        (
            _position.positionSize,
            _position.entryPrice,
        ) = VAmm(_amm).openPosition(_loanAmt, _side);
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
        require(
            payInterestPayments(_tradeId, _position.amm),
            ""
        );
        // require(calcFFR(_tradeId,_position.amm), "close position failed");
        int _usdcAmt;
        uint _exitPrice;
        ( _exitPrice, _usdcAmt) = VAmm(_position.amm).closePosition(
            _position.positionSize,
            _position.side
        );
        uint _loanAmount = tradeBalance[_tradeId];
        _usdcAmt -= int(_loanAmount);
        tradeBalance[_tradeId] = 0;
        require(
            repayLoan(_tradeId, _loanAmount, _position.amm),
          ""
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
        require(
            payInterestPayments(_tradeId, _position.amm),
            ""
        );
        // require(calcFFR(_tradeId,_amm), "ffr payment failed");
        require(
            availableBalance[msg.sender] >= _addedCollateral, "");
        availableBalance[msg.sender] -= _addedCollateral;
        tradeCollateral[_tradeId] += _addedCollateral;
        uint _newLoan = _leverage * _addedCollateral;
        require(
            borrow(_tradeId, _position.amm, _newLoan),
            ""
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
    ) public returns (bool) {}

        /**
     *@dev Function to pay the funding rate for a position
     @param _tradeId The tradeId of the position
     @param _amm The address of the AMM contract
     @return A boolean value indicating whether the operation succeeded
     */
    function payFFR(bytes memory _tradeId, address _amm) internal returns (bool) {
        uint _ffrToBePayed = calcFFR(_tradeId, _amm);
        if (tradeCollateral[_tradeId] >= _ffrToBePayed) {
            tradeCollateral[_tradeId] -= _ffrToBePayed;
            tradeInterest[_tradeId] += _ffrToBePayed;
            positions[_tradeId].collateral - _ffrToBePayed;
            positions[_tradeId].lastFundingRate = block.timestamp;
            require(payInterest(_tradeId), "");
        } else {
            liquidate(_tradeId);
        }

        return true;
    }


    function calcFFR(
        bytes memory _tradeId,
        address _amm
    ) internal view returns (uint) {
        // Position memory _position = positions[_tradeId];
        // VAmm _vamm = VAmm(_amm);
        uint _ffr = 1;
        return _ffr;
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
    }

}
