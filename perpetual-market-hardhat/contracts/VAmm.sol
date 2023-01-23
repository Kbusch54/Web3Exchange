// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol"; 
// import "./IVAmm.sol";
import "hardhat/console.sol";

 contract VAmm {

          using SafeMath for int;

    address public assest;
    bytes32 public path;
    uint public indexPrice;
    uint public k;
    uint8 public indexPricePeriod;
    bool public isFrozen;
    uint public lastFundingRateIndex;
    uint absolutePositionSize;//when zero and upon new trade set market price to index price

    struct LiquidityChangedSnapshot {
         //longsCollateral - shortsCollateral
        int cumulativeNotional;
        // every open/close position, funding rate will be updated 
        // final FR for this period will adjust VAMM's assets based on this
        int fundingRate;
        //start timestamp
        uint timestamp;
        //start block number
        uint blockNumber;
        //long pSIze - short pSize
        int totalPositionSize;
        //index asset amount in vAMM
        uint quoteAssetReserve;
        //usdc in VAmm
        uint baseAssetReserve;
        //start index price not used in FR calculation for this period
        uint startIndexPrice;
        //final index price of period
        uint finalIndexPrice;
    }
    modifier onlyExchange(){
        require(msg.sender == exchange,"only exchange");
        _;
    }

 address private exchange;


    LiquidityChangedSnapshot[] public liquidityChangedSnapshots;

//only doa
    function init(address _assest, string memory _path,uint _indexPrice,uint _quoteAssetAmount,uint8 _indexPricePeriod,address _exchange)external{
        assest = _assest;
        path = keccak256(abi.encodePacked(_path));
        indexPrice = _indexPrice;
        k= indexPrice*_quoteAssetAmount**2;
        uint _baseAsset  = k/_quoteAssetAmount;
        liquidityChangedSnapshots.push(LiquidityChangedSnapshot({
            cumulativeNotional:0,
            fundingRate:0,
            timestamp:block.timestamp,
            blockNumber:block.number,
            totalPositionSize:0,
            quoteAssetReserve:_quoteAssetAmount,
            baseAssetReserve:_baseAsset,
            startIndexPrice:_indexPrice,
            finalIndexPrice:0
        }));
        indexPricePeriod = _indexPricePeriod;
        exchange = _exchange;

    }
    function getLastFundingRateIndex()external view returns(uint){
        return lastFundingRateIndex;
    }
    // only oracle/keeper
    function setIndexPrice(uint _price)external{
        require(_price>0,"price must be greater than 0");
        require(!isFrozen,"VAmm is frozen");
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        require(lastSnapshot.blockNumber+indexPricePeriod>=block.number,"Need to wait for loan block period");
        //set last index price
        lastSnapshot.finalIndexPrice = _price;
        //set new index price
        liquidityChangedSnapshots[liquidityChangedSnapshots.length-1] = lastSnapshot;
        indexPrice = _price;
        adjustFundingPaymentsAll();
   
    }
 
    function getLastAssetSpotPrice()external view returns(uint){
        return indexPrice;
    }
    function getAssetPrice()external view returns(uint){
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        return lastSnapshot.baseAssetReserve/lastSnapshot.quoteAssetReserve;
    }
    function getAssetReserve()external view returns(uint){
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        return lastSnapshot.baseAssetReserve;
    }
    function getQuoteReserve()external view returns(uint){
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        return lastSnapshot.quoteAssetReserve;
    }
    function getLiquidityChangedSnapshots()external view returns(LiquidityChangedSnapshot[] memory){
        return liquidityChangedSnapshots;
    }
    function getLastSnapshot()external view returns(LiquidityChangedSnapshot memory){
        return liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
    }
    function getSnapshotByIndex(uint index)external view returns(LiquidityChangedSnapshot memory){
        return liquidityChangedSnapshots[index];
    }
    //only exchange

    function openPosition(uint totalCollateral,int _side)external returns(int positionSize,uint avgEntryPrice,uint openValue){
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        int _newBaseAsset = int(lastSnapshot.baseAssetReserve) +(int(totalCollateral)*_side);
        uint _newQuoteAsset = k/ uint(_newBaseAsset);
        int _quoteWPZ = intToFixed(int(k))/_newBaseAsset;
        positionSize = intToFixed(int(lastSnapshot.quoteAssetReserve)) - _quoteWPZ;
        avgEntryPrice = uint(intToFixed(int(totalCollateral))/(positionSize)*(_side));
        lastSnapshot.quoteAssetReserve = _newQuoteAsset;
        lastSnapshot.baseAssetReserve = uint(_newBaseAsset);
        lastSnapshot.cumulativeNotional += int(totalCollateral)*_side;
        lastSnapshot.totalPositionSize += positionSize;
        openValue = uint(fixedToInt(int(uint(_newBaseAsset)/_newQuoteAsset * uint(positionSize*_side))));
        liquidityChangedSnapshots[liquidityChangedSnapshots.length-1]=lastSnapshot;
        updateFutureFundingRate();
    } 

    function updateFutureFundingRate()internal returns(int){
         LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
         int _newFundingRate = calculateFundingRate(int(lastSnapshot.baseAssetReserve)/int(lastSnapshot.quoteAssetReserve),int(indexPrice));
         lastSnapshot.fundingRate = _newFundingRate;
         liquidityChangedSnapshots[liquidityChangedSnapshots.length-1] =  lastSnapshot;

       return  _newFundingRate;
    }
    function calculateFundingRate(int markPrice, int _indexPrice)public pure returns(int){
        return intToFixed(_indexPrice - markPrice)/_indexPrice/24;
    }
    //only exchange
    function closePosition(int positionSize,int _side)external returns(uint exitPrice,int usdcAmt){
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        lastSnapshot.totalPositionSize-=positionSize; 
        int quoteWPsz = int(lastSnapshot.quoteAssetReserve) + fixedToInt(positionSize);
        uint newBaseAsset = k/ uint(quoteWPsz);
         usdcAmt =(int(lastSnapshot.baseAssetReserve)- int(newBaseAsset)) * _side;
        lastSnapshot.cumulativeNotional -= usdcAmt * _side;
        lastSnapshot.quoteAssetReserve = uint(quoteWPsz);
        lastSnapshot.baseAssetReserve = newBaseAsset;
        liquidityChangedSnapshots[liquidityChangedSnapshots.length-1] = lastSnapshot;
        exitPrice = uint(intToFixed(int(usdcAmt))/(positionSize));
        updateFutureFundingRate();
    }


    function adjustFundingPaymentsAll()internal {
        updateFutureFundingRate();
        LiquidityChangedSnapshot memory lastSnapshot = liquidityChangedSnapshots[liquidityChangedSnapshots.length-1];
        require(lastSnapshot.blockNumber+indexPricePeriod>=block.number,"Need to wait for loan block period");
        int nbR =  int(lastSnapshot.baseAssetReserve) *(100000000+lastSnapshot.fundingRate);
        uint _newBaseAsset = uint(fixedToInt(nbR>0?nbR:nbR*-1));
        uint _newQuoteAsset = k/ _newBaseAsset;
        lastSnapshot.quoteAssetReserve = _newQuoteAsset;  
        lastSnapshot.baseAssetReserve = _newBaseAsset;
        lastSnapshot.blockNumber = block.number;
        lastSnapshot.timestamp = block.timestamp;
        lastSnapshot.startIndexPrice = lastSnapshot.finalIndexPrice;
        lastSnapshot.finalIndexPrice =0;
        liquidityChangedSnapshots.push(lastSnapshot);
        lastFundingRateIndex = liquidityChangedSnapshots.length-1;
        updateFutureFundingRate();
    }
    function intToFixed(int y)public pure returns(int x){
        return y*(10 ** 8);
  }
    function fixedToInt(int x)public pure returns(int y){
        return x/(10 ** 8);
  }
 
}