// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Interfaces/IVaultMain.sol";
import "./Interfaces/IVAmm.sol";
import "hardhat/console.sol";
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
    
        console.log("block num", block.number);
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
        (uint interestPayed,uint newLoanAmount,uint minimumMarginReq)= IVaultMain(Vault).repayLoan( _tradeId, position.loanedAmount);
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

    // function addLiquidityToPosition(bytes memory _tradeId, uint _collateral,uint _leverage)public returns(bool){
    //     require(ammActive[_amm], "amm not active");
    //     require(isTradeActive[_tradeId], "trade not active");
    //     Position memory position = positionsbyTradeId[_tradeId];
    //     require(position.margin > 0, "position already closed");
    //     require(position.startBlock > 0, "position not found");
    //     //check if trader has enough collateral from vault
    //         //get new margin requirements
    //         //pay interest on current loan 
    //         //debit/credit from loan payments and funding rate
    //         //update position
    //     //update position
    //     (bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq) = IVaultMain(Vault).secureLoanAndTrade( _tradeId,  _leverage,  _collateral);
    // require(check, "loan not approved");

    //     // right to trade on AMM


    //     (int additionalPositionSize,uint avgEntryPrice,uint openValue) = IVAmm(ammToPool[_amm]).openPosition(totalCollateral,_side);
    //     position.entryPrice = (position.entryPrice * position.positionSize + avgEntryPrice * additionalPositionSize) / (position.positionSize + additionalPositionSize);
    //     position.positionSize += additionalPositionSize;
    //     position.loanedAmount = _tradeBalance;
    //     // position.
    //     //event
    //     return true;

    // }
    // //lowering risk by paying back part of the loan and reducing margin
    function removeLiquidityFromPosition(bytes memory _tradeId, uint _collateral)public returns(bool,int usdcAmt){
        
        Position memory position = positions[positionsbyTradeId[_tradeId]];
        require(ammActive[position._amm], "amm not active");
        require(isTradeActive[_tradeId], "trade not active");
        require(position.startBlock > 0, "position not found");
        require(position.margin > 0, "position already closed");
        
        //check if trader has enough collateral from vault
            //tell vault fee from interest if applicable

        // tell amm to close portion of trade
        //tell vault to transfer usdc to party
        //check new margin req
        // (uint interestPayed,uint newLoanAmount,uint minimumMarginReq)= IVaultMain(Vault).repayLoan( _tradeId,  _collateral);
        //update position
            // (int additionalPositionSize,uint avgEntryPrice,uint openValue) = IVAmm(ammToPool[_amm]).closePosition(totalCollateral,_side);
            // position.entryPrice = (position.entryPrice * position.positionSize + avgEntryPrice * additionalPositionSize) / (position.positionSize + additionalPositionSize);
            // position.positionSize -= additionalPositionSize;
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
