// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Interfaces/IVAmm.sol";
import "../Interfaces/IVaultMain.sol";
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
    }

    mapping(bytes32 => Position) public positionsbyTradeId;
    mapping(address => address)ammToPool;
    mapping(bytes32=>bool)isTradeActive;

    function getPosition(bytes32 _tradeId) public view returns(Position memory){
        return positionsbyTradeId[_tradeId];
    }

    function openPosition(address _trader,address _amm,uint _collateral, uint _leverage, int _side) public returns(bytes32){
        require(ammActive[_amm], "amm not active");
        require(_side == 1 || _side == -1, "side must be 1 or -1");
        require(_collateral > 0, "collateral must be greater than 0");
        require(_leverage > 0, "leverage must be greater than 0");
        bytes32 tradeId = keccak256(abi.encodePacked( _amm, block.number,_side, _trader));
        require(isTradeActive[tradeId] == false, "trade already active");
        uint totalCollateral;
        uint margin;
        uint loanedAmount;

        //getloan
        (bool _check,uint newBalance,uint _tradeBalance,uint minimumMarginReq) = IVaultMain(Vault).secureLoanAndTrade(_trader, _collateral, _leverage, totalCollateral, margin, loanedAmount);
        require(check, "loan not approved");
        IVAmm amm = IVAmm(ammToPool[_amm]);
        uint lastFFr = amm.lastFundingRateIndex();
        // right to trade
        (int positionSize,uint avgEntryPrice,uint openValue) = amm.openPosition(_tradeBalance,_side);
        positionsbyTradeId[tradeId] = Position(_collateral-minimumMarginReq,_tradeBalance,_side,positionSize,avgEntryPrice,openValue,block.number,lastFFr);
        isTradeActive[tradeId] = true;;
        //event
        return tradeId;
    }

    function closeOutPosition(bytes32 _tradeId) public returns(uint avgExitPrice,int usdcAmt){
        Position memory position = positionsbyTradeId[_tradeId];
        require(position.startBlock > 0, "position not found");
       //for liqidtaiton as well
        //check if trader has enough collateral from vault
            //tell vault fee from interest if applicable
            //tell vault fee for trade % of total collateral        
        // right to trade
        ( uint _avgExitPrice, int _usdcAmt) = IVAmm(ammToPool[ammToPool[_tradeId]]).closePosition(position.positionSize, position.side);
        //tell vault to transfer usdc to party
        // IVaultMain(Vault).repayLoan(bytes32 _tradeId, uint _amount)external returns(uint interestPayed,uint newLoanAmount,uint minimumMarginReq)
        //funding rate
        //event
        isTradeActive[_tradeId] = false;
        return (_avgExitPrice, _usdcAmt);
    }

    function addLiquidityToPosition(bytes32 _tradeId, uint _collateral)public returns(bool){
        require(ammActive[_amm], "amm not active");
        require(isTradeActive[_tradeId], "trade not active")
        Position memory position = positionsbyTradeId[_tradeId];
        require(position.margin > 0, "position already closed")
        require(position.startBlock > 0, "position not found");
        //check if trader has enough collateral from vault
            //tell vault fee from interest if applicable
            //tell vault fee for trade % of total collateral
        //update position

        // right to trade on AMM


        (int additionalPositionSize,uint avgEntryPrice,uint openValue) = IVAmm(ammToPool[_amm]).openPosition(totalCollateral,_side);
        position.entryPrice = (position.entryPrice * position.positionSize + avgEntryPrice * additionalPositionSize) / (position.positionSize + additionalPositionSize);
        position.positionSize += additionalPositionSize;
        //event
        return true;

    }
    removeLiquidityFromPosition(bytes32 _tradeId, uint _collateral)public returns(bool,int usdcAmt){
        require(ammActive[_amm], "amm not active");
        require(isTradeActive[_tradeId], "trade not active");
        Position memory position = positionsbyTradeId[_tradeId];
        require(position.startBlock > 0, "position not found");
        require(position.margin > 0, "position already closed")
        
        //check if trader has enough collateral from vault
            //tell vault fee from interest if applicable

        // tell amm to close portion of trade
        //tell vault to transfer usdc to party
        //check new margin req
        (uint interestPayed,uint newLoanAmount,uint minimumMarginReq)= IVaultMain(Vault).repayLoan(bytes32 _tradeId, uint _collateral);
        //update position
            // (int additionalPositionSize,uint avgEntryPrice,uint openValue) = IVAmm(ammToPool[_amm]).closePosition(totalCollateral,_side);
            // position.entryPrice = (position.entryPrice * position.positionSize + avgEntryPrice * additionalPositionSize) / (position.positionSize + additionalPositionSize);
            // position.positionSize -= additionalPositionSize;
    }


    function getTotalFundingRate(bytes32 _tradeId)public view returns(int){
        Position memory position = positionsbyTradeId[_tradeId];
        require(position.startBlock > 0, "position not found");
        uint posLastFFr = position.lastFundingRateBlock;
        uint lastFFr = IVAmm(ammToPool[_amm]).lastFundingRateIndex();
        int cumulativeFFR;
        for(uint i = posLastFFr; i < lastFFr; i++){
            cumulativeFFR += IVAmm(ammToPool[_amm]).liquidityChangedSnapshots(i).fundingRate ;
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
