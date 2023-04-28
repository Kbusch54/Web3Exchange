// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./LoanPool.sol";
import "../amm/VAmm.sol";

contract Exchange is LoanPool{

    constructor(address _usdc, address _poolTokens)LoanPool(_usdc,_poolTokens){

    }
    mapping(bytes=>bool)public isActive;

    struct Position{
        uint collateral;
        uint loanedAmount;
        int side;
        int positionSize;
        uint entryPrice;
        uint openValue;
        uint timeStamp;
        uint lastFundingRate;
        address amm;
    }

    mapping(bytes=>Position)public positions;


    function openPosition(address _amm, uint _collateral, uint _leverage, int _side) public returns(bool){
        require(isFrozen[_amm], "amm not active");
        require(_side == 1 || _side == -1, "side must be 1 or -1");
        require(_collateral > 0, "collateral must be greater than 0");
        require(_leverage > 0, "leverage must be greater than 0");

        require(availableBalance[msg.sender] >= _collateral, "not enough balance");
        bytes memory _tradeId = abi.encodePacked(msg.sender, _amm, block.timestamp,_side);
        uint _loanAmt = _collateral * _leverage;
        availableBalance[msg.sender] -= _collateral;
        totalTradeCollateral[msg.sender] += _collateral;
        tradeCollateral[_tradeId] += _collateral;
        tradeBalance[_tradeId] += _loanAmt;

        require(borrow(_tradeId , _collateral, _loanAmt, _amm), "borrow failed");

        positions[_tradeId].collateral = _collateral;
        positions[_tradeId].loanedAmount = _loanAmt;
        positions[_tradeId].side = _side;
        positions[_tradeId].timeStamp = block.timestamp;
        positions[_tradeId].amm = _amm;
        (positions[_tradeId].positionSize, positions[_tradeId].entryPrice, positions[_tradeId].openValue)=VAmm(_amm).openPosition(_loanAmt, _side);
        isActive[_tradeId] = true;
        return true;
    }

}