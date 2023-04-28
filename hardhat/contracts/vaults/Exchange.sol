// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./LoanPool.sol";
import "../amm/VAmm.sol";

import "hardhat/console.sol";

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
        uint exitPrice;
        uint lastFundingRate;
        address amm;
    }
    //array of tradIds for each user
    mapping(address=>bytes[])public tradeIds;

    mapping(bytes=>Position)public positions;


function getTradeIds(address _user)public view returns(bytes[] memory){
    return tradeIds[_user];
}
    function openPosition(address _amm, uint _collateral, uint _leverage, int _side) public returns(bool){
        require(!isFrozen[_amm], " exchange amm not active");
        require(_side == 1 || _side == -1, "side must be 1 or -1");
        require(_collateral > 0, "collateral must be greater than 0");
        require(_leverage > 0, "leverage must be greater than 0");

        require(availableBalance[msg.sender] >= _collateral, "not enough balance");
        bytes memory _tradeId = abi.encodePacked(msg.sender, _amm, block.timestamp,_side);
        uint _loanAmt = _collateral * _leverage;
        console.log("loan amt", _loanAmt);
        availableBalance[msg.sender] -= _collateral;
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
        tradeIds[msg.sender].push(_tradeId);
        return true;
    }
    function closeOutPosition(bytes memory _tradeId)public returns(bool,int,uint){
        (address _user, address _amm, uint _timeStamp, int _side) = decodeTradeId(_tradeId);
        require(isActive[_tradeId], "trade not active");
        require(msg.sender == _user, "not authorized");
        require(payInterestPayments(_tradeId,_amm), "pay interest failed");
        // require(calcFFR(_tradeId,_amm), "close position failed");
        int _usdcAmt;
        (positions[_tradeId].exitPrice,_usdcAmt)= VAmm(_amm).closePosition(positions[_tradeId].positionSize, positions[_tradeId].side);
        tradeBalance[_tradeId] =0;
        uint _loanAmount = tradeBalance[_tradeId];
        _usdcAmt -= _loanAmount;
        require(repayLoan(_tradeId, _loanAmount, _amm), "repay loan failed");
        _usdcAmt>=0?tradeCollateral[_tradeId] += uint(_usdcAmt):tradeCollateral[_tradeId] -= uint(_usdcAmt*-1);
        availableBalance[msg.sender] += tradeCollateral[_tradeId];
        isActive[_tradeId] = false;
        _usdcAmt+=int(tradeCollateral[_tradeId]);
        tradeCollateral[_tradeId] = 0;
        return (true, _usdcAmt, positions[_tradeId].exitPrice);

    }
    function payInterestPayments(bytes memory _tradeId,address _amm)public returns(bool){
        uint _interestToBePayed = interestOwed(_tradeId,_amm);
        if(tradeCollateral[_tradeId] >= _interestToBePayed){
            tradeCollateral[_tradeId] -= _interestToBePayed;
            tradeInterest[_tradeId] += _interestToBePayed;
            positions[_tradeId].collateral - _interestToBePayed;
            require(payInterest(_tradeId), "pay interest failed");
        }else{
            liquidate(_tradeId);
        }

        return true;
    }
    function payFFR(bytes memory _tradeId,address _amm)public returns(bool){
        uint _ffrToBePayed = calcFFR(_tradeId,_amm);
        if(tradeCollateral[_tradeId] >= _ffrToBePayed){
            tradeCollateral[_tradeId] -= _ffrToBePayed;
            tradeInterest[_tradeId] += _ffrToBePayed;
            positions[_tradeId].collateral - _ffrToBePayed;
            require(payInterest(_tradeId), "pay interest failed");
        }else{
            liquidate(_tradeId);
        }

        return true;
    }

    function liquidate(bytes memory _tradeId)pubic{
        2+2;
    }


    function initializeVamm(address _amm)public {
        require(!isFrozen[_amm], "amm already initialized");
        isFrozen[_amm] = false;
        maxLoan[_amm] = 1000000000;
        minLoan[_amm] = 1000000;
        loanInterestRate[_amm] = 10000;
        interestPeriods[_amm] = 2 hours;
        mmr[_amm] = 50000;
        minHoldingsReqPercentage[_amm] = 20000;

    }
    function decodeTradeId(bytes memory encodedData) public pure returns(address, address, uint, int){
        (address _user, address _amm, uint _timeStamp, int _side) = abi.decode(encodedData, (address, address, uint, int));
        return (_user, _amm, _timeStamp, _side);
    }

}