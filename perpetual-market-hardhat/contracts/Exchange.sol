// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Interfaces/IVaultMain.sol";
import "./Interfaces/IVAmm.sol";
import "hardhat/console.sol";

//@TODO: add events
//@TODO: add modifiers
//@TODO: CALCULATE FFR correctly
contract Exchange{
    address[] public amms;
    address public Vault;
    mapping(address => bool) public ammActive;

    constructor(address[] memory _amms, address _vault){
        amms = _amms;
        Vault = _vault;
        for(uint i = 0; i < amms.length; i++){
            ammActive[amms[i]] = true;
        }
    }
    struct Position{
        uint margin;
        uint loanedAmount;
        int side;
        int positionSize;
        uint entryPrice;
        uint openValue;
        uint startBlock;
        uint lastFundingRateIndex;
        address _amm;
    }

    mapping(bytes => uint) public positionsbyTradeId;
    mapping(address => address)ammToPool;
    mapping(bytes=>bool)public isTradeActive;


    Position [] public  positions;
    function getPosition(bytes memory _tradeId) public view returns(Position memory){
        
        Position memory pos =  positions[positionsbyTradeId[_tradeId]];
        return pos;
    }

    //have checks 
    function registerPool(address _amm, address _pool) public{
        ammToPool[_amm] = _pool;
    }

    function openPosition(address _trader,address _amm,uint _collateral, uint _leverage, int _side) public returns(bytes memory){
        require(ammActive[_amm], "amm not active");
        require(_side == 1 || _side == -1, "side must be 1 or -1");
        require(_collateral > 0, "collateral must be greater than 0");
        require(_leverage > 0, "leverage must be greater than 0");
    
        bytes memory tradeId = abi.encode( _amm, block.number,_side, _trader,ammToPool[_amm]);

        require(isTradeActive[tradeId] == false, "trade already active");
        //getloan
        (bool _check,,uint _tradeBalance,) = IVaultMain(Vault).secureLoanAndTrade( tradeId,  _leverage,  _collateral);
        require(_check, "loan not approved");
        IVAmm amm = IVAmm(_amm);
        uint lastFFr = amm.getLastFundingRateIndex();
        // right to trade
    
        (int positionSize,uint avgEntryPrice,uint openValue) = amm.openPosition(_tradeBalance,_side);
        Position memory position = Position(_collateral,_tradeBalance,_side,positionSize,avgEntryPrice,openValue,block.number,lastFFr,_amm);
        positions.push(position);
        positionsbyTradeId[tradeId] = positions.length - 1;
        
        isTradeActive[tradeId] = true;
        //event
    
        return tradeId;
    }

    function closeOutPosition(bytes memory _tradeId) public returns(uint avgExitPrice,int usdcAmt){
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(position.startBlock > 0, "position not found");
       //for liqidtaiton as well
        //check if trader has enough collateral from vault
            //tell vault fee from interest if applicable
            //tell vault fee for trade % of total collateral        
        // right to trade
        ( uint _avgExitPrice, int _usdcAmt) = IVAmm(position._amm).closePosition(position.positionSize, position.side);
        //tell vault to transfer usdc to party
        (uint interestPayed,uint newLoanAmount,uint minimumMarginReq)= IVaultMain(Vault).repayLoan( _tradeId, position.loanedAmount,uint(_usdcAmt));
        //funding rate
        require(newLoanAmount == 0, "loan not paid back");
        position.margin = 0;
        position.loanedAmount = 0;
        position.positionSize = 0;
        position.margin = 0;
        positions[positionsbyTradeId[_tradeId]] = position;
        //event
        isTradeActive[_tradeId] = false;
        return (_avgExitPrice, _usdcAmt);
    }

    //another loan

    function addLiquidityToPosition(bytes memory _tradeId, uint _collateral,uint _leverage,address _amm)public returns(bool){
        // function addLiquidityWithLoan(bytes memory _tradeId, uint _levOnAddedColl, uint _addedColl)
        require(ammActive[_amm], "amm not active");
        // public returns(bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq)
        require(isTradeActive[_tradeId], "trade not active");
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(position.margin > 0, "position already closed");
        require(position.startBlock > 0, "position not found");
        (bool _check,,uint _tradeBalance,) = IVaultMain(Vault).addLiquidityWithLoan( _tradeId,  _leverage,  _collateral);
       //debit/credit from loan payments and funding rate
        require(_check, "loan not approved");
        // right to trade on AMM
            (int additionalPositionSize,uint avgEntryPrice,) = IVAmm(_amm).openPosition(_tradeBalance - position.loanedAmount,position.side);
        //update position
            position.entryPrice = uint((int(position.entryPrice) * position.positionSize + int(avgEntryPrice) * additionalPositionSize) / (position.positionSize + additionalPositionSize));
            position.positionSize += additionalPositionSize;
            position.loanedAmount = _tradeBalance;
            // position.
            positions[positionsbyTradeId[_tradeId]] = position;
            //event
            return true;
    }
    function addLeverage(bytes memory _tradeId,uint _newLev)public returns(bool){
        require(isTradeActive[_tradeId], "trade not active");
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(position.margin > 0, "position already closed");
        require(position.startBlock > 0, "position not found");
        uint _oldLev =position.loanedAmount/position.margin;
        require(_newLev > _oldLev, "new leverage must be greater than current leverage");
        //check new margin req
        (bool check, uint _newTradeBalance, ) = IVaultMain(Vault).addLeverageToLoan(_tradeId,_oldLev,_newLev);
        require(check, "loan not approved");
        //update position
        IVAmm amm = IVAmm(position._amm);
        (int additionalPositionSize,uint avgEntryPrice,) = amm.openPosition(_newTradeBalance - position.loanedAmount,position.side);
        position.loanedAmount = _newTradeBalance;
        position.entryPrice = uint((int(position.entryPrice) * position.positionSize + int(avgEntryPrice) * additionalPositionSize) / (position.positionSize + additionalPositionSize));
        position.positionSize += additionalPositionSize;
        positions[positionsbyTradeId[_tradeId]] = position;
        return true;
    }
    // //lowering risk by paying back part of the loan and reducing margin
    function removeLiquidityFromPosition(bytes memory _tradeId, int _positionSize)public returns(bool check,int usdcAmt,uint _avgExitPrice,uint _newMinMarg,int _pnl){
        
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(ammActive[position._amm], "amm not active");
        require(isTradeActive[_tradeId], "trade not active");
        require(position.startBlock > 0, "position not found");
        require(position.margin > 0, "position already closed");

            uint loanToRepay =(uint(100000000*_positionSize / position.positionSize) * position.loanedAmount)/100000000;    
        // right to trade
        ( uint avgExitPrice, int _usdcAmt) = IVAmm(position._amm).closePosition(_positionSize*position.side, position.side);
        //tell vault to transfer usdc to party
        (,uint newLoanAmount,uint  minMargReq)= IVaultMain(Vault).repayLoan( _tradeId, loanToRepay,uint(_usdcAmt));
        //funding rate
        // need to figure out repay loan
        _newMinMarg = minMargReq;
        usdcAmt = _usdcAmt;
        _avgExitPrice = avgExitPrice;
        _pnl = _usdcAmt - int(loanToRepay);
        position.loanedAmount = newLoanAmount;
        position.positionSize -= _positionSize;
        positions[positionsbyTradeId[_tradeId]] = position;
        check = true;
    }


    function getTotalFundingRate(bytes memory _tradeId)public view returns(int){
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(position.startBlock > 0, "position not found");
        uint posLastFFr = position.lastFundingRateIndex;
        IVAmm amm = IVAmm(position._amm);
        uint lastFFr = amm.getLastFundingRateIndex();
        int cumulativeFFR;
        for(uint i = posLastFFr; i < lastFFr; i++){
            cumulativeFFR += amm.getSnapshotByIndex(i).fundingRate ;
        }
        return cumulativeFFR;

    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////AMM functions////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
    function getAMMs() public view returns(address[] memory){
        return amms;
    }


// only DAO can add AMM
    function addAMM(address _amm) public {
        amms.push(_amm);
    }

// only DAO can remove AMM
    function removeAMM(address _amm) public {
        for(uint i = 0; i < amms.length; i++){
            if(amms[i] == _amm){
                amms[i] = amms[amms.length - 1];
                amms.pop();
                break;
            }
        }
    }



}
