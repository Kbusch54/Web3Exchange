// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "./IVAmm.sol";
import "../../node_modules/hardhat/console.sol";

/**
 * @title VAmm
 * @dev A custom implementation of a Virtual Automated Market Maker (VAMM) contract.
 */
contract VAmm {
    using SafeMath for int;

    address public assest;
    bytes32 public path;
    uint public indexPrice;
    uint public k;
    uint16 public indexPricePeriod;
    bool public isFrozen;
    uint public lastFundingRateIndex;
    uint public absolutePositionSize; //when zero and upon new trade set market price to index price
    /**
     * @dev Struct representing a snapshot of liquidity changes.
     */
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
    modifier onlyExchange() {
        require(msg.sender == exchange, "only exchange");
        _;
    }

    address private exchange;

    LiquidityChangedSnapshot[] public liquidityChangedSnapshots;

    /**
     * @dev Initializes the VAMM contract with given parameters.
     * @param _assest Address of the asset.
     * @param _path Path of the asset.
     * @param _indexPrice Initial index price of the asset.
     * @param _quoteAssetAmount Initial quote asset amount.
     * @param _indexPricePeriod Index price update period in blocks.
     * @param _exchange Address of the exchange contract.
     */
    function init(
        address _assest,
        string memory _path,
        uint _indexPrice,
        uint _quoteAssetAmount,
        uint16 _indexPricePeriod,
        address _exchange
    ) external {
        assest = _assest;
        path = keccak256(abi.encodePacked(_path));
        indexPrice = _indexPrice;
        // k= indexPrice*_quoteAssetAmount*100;
        // uint _baseAsset  = k/_quoteAssetAmount;
        uint _baseAsset = _quoteAssetAmount * _indexPrice;
        k = _baseAsset * _quoteAssetAmount;
        liquidityChangedSnapshots.push(
            LiquidityChangedSnapshot({
                cumulativeNotional: 0,
                fundingRate: 0,
                timestamp: block.timestamp,
                blockNumber: block.number,
                totalPositionSize: 0,
                quoteAssetReserve: _quoteAssetAmount * 100000000,
                baseAssetReserve: _baseAsset,
                startIndexPrice: _indexPrice,
                finalIndexPrice: 0
            })
        );
        indexPricePeriod = _indexPricePeriod;
        exchange = _exchange;
    }

    function unFreeze(uint _indexPrice,uint _quoteAssetAmount) internal {
        isFrozen = false;
        indexPrice = _indexPrice;
        // k= indexPrice*_quoteAssetAmount*100;
        // uint _baseAsset  = k/_quoteAssetAmount;
        uint _baseAsset = _quoteAssetAmount * _indexPrice;
        k = _baseAsset * _quoteAssetAmount;
        liquidityChangedSnapshots.push(
            LiquidityChangedSnapshot({
                cumulativeNotional: 0,
                fundingRate: 0,
                timestamp: block.timestamp,
                blockNumber: block.number,
                totalPositionSize: 0,
                quoteAssetReserve: _quoteAssetAmount * 100000000,
                baseAssetReserve: _baseAsset,
                startIndexPrice: _indexPrice,
                finalIndexPrice: 0
            })
        );
    }

    /**
     * @dev Gets the last funding rate index.
     * @return An unsigned integer representing the last funding rate index.
     */
    function getLastFundingRateIndex() external view returns (uint) {
        return lastFundingRateIndex;
    }

    /**
     * @dev Sets the index price for the asset.
     * @param _price New index price.
     */
    function setIndexPrice(uint _price) external {
        require(!isFrozen, "VAmm is frozen");
        require(_price > 0, "price must be greater than 0");
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        console.log("lastSnapshot.blockNumber", lastSnapshot.timestamp);
        console.log("indexPricePeriod", indexPricePeriod);
        console.log("block.number", block.timestamp);
        require(
            lastSnapshot.timestamp + indexPricePeriod >= block.timestamp -15 minutes && lastSnapshot.timestamp + indexPricePeriod <= block.timestamp +15 minutes,
            "Need to wait for time period"
        );
        //set last index price
        lastSnapshot.finalIndexPrice = _price;
        //set new index price
        liquidityChangedSnapshots[
        liquidityChangedSnapshots.length - 1
        ] = lastSnapshot;
        indexPrice = _price;
        adjustFundingPaymentsAll();
    }

    /**
     * @dev Gets the last asset spot price.
     * @return An unsigned integer representing the last asset spot price.
     */
    function getLastAssetSpotPrice() external view returns (uint) {
        return indexPrice;
    }

    /**
     * @dev Gets the current asset price.
     * @return An unsigned integer representing the current asset price.
     */
    function getAssetPrice() public view returns (uint) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        return
            (lastSnapshot.baseAssetReserve * 100000000) /
            lastSnapshot.quoteAssetReserve;
    }

    /**
     * @dev Gets the asset reserve.
     * @return An unsigned integer representing the asset reserve.
     */
    function getAssetReserve() external view returns (uint) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        return lastSnapshot.baseAssetReserve;
    }

    /**
     * @dev Gets the quote reserve.
     * @return An unsigned integer representing the quote reserve.
     */
    function getQuoteReserve() external view returns (uint) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        return lastSnapshot.quoteAssetReserve;
    }

    /**
     * @dev Gets all liquidity changed snapshots.
     * @return An array of Liquidity ChangedSnapshot structs.
     */
    function getLiquidityChangedSnapshots()
        external
        view
        returns (LiquidityChangedSnapshot[] memory)
    {
        return liquidityChangedSnapshots;
    }

    /**
     * @dev Gets the last snapshot.
     * @return A LiquidityChangedSnapshot struct representing the last snapshot.
     */
    function getLastSnapshot()
        external
        view
        returns (LiquidityChangedSnapshot memory)
    {
        return liquidityChangedSnapshots[liquidityChangedSnapshots.length - 1];
    }

    /**
     * @dev Gets the snapshot by index.
     * @param index Index of the snapshot.
     * @return A LiquidityChangedSnapshot struct representing the snapshot at the given index.
     */
    function getSnapshotByIndex(
        uint index
    ) external view returns (LiquidityChangedSnapshot memory) {
        return liquidityChangedSnapshots[index];
    }

    //only exchange
    /**
     * @dev Opens a position.
     * @param totalCollateral Total collateral for the position.
     * @param _side Side of the position (long or short).
     * @return positionSize The size of the opened position.
     * @return avgEntryPrice The average entry price of the position.
     * @return openValue The open value of the position.
     */
    function openPosition(
        uint totalCollateral,
        int _side
    ) external returns (int positionSize, uint avgEntryPrice, uint openValue) {
        console.log("openPosition");
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
            //get oracle index price
            if(isFrozen){
                unFreeze(indexPrice,totalCollateral);
            }
        int _newBaseAsset = int(lastSnapshot.baseAssetReserve) +
            (int(totalCollateral) * _side);
        uint _newQuoteAsset = uint(intToFixed(int(k))) / uint(_newBaseAsset);
        positionSize =
            int(lastSnapshot.quoteAssetReserve) -
            int(_newQuoteAsset);
        int _avgEntryPrice = intToFixed(int(totalCollateral)) / (positionSize);
        avgEntryPrice = uint(
            _avgEntryPrice > 0 ? _avgEntryPrice : _avgEntryPrice * -1
        );
        absolutePositionSize += uint(positionSize* _side);
        console.log("absolutePositionSize", absolutePositionSize);
        lastSnapshot.quoteAssetReserve = _newQuoteAsset;
        lastSnapshot.baseAssetReserve = uint(_newBaseAsset);
        lastSnapshot.cumulativeNotional += int(totalCollateral) * _side;
        lastSnapshot.totalPositionSize += positionSize;
        openValue = uint(
            fixedToInt(
                (intToFixed(_newBaseAsset) / int(_newQuoteAsset)) *
                    positionSize *
                    _side
            )
        );
        liquidityChangedSnapshots[
            liquidityChangedSnapshots.length - 1
        ] = lastSnapshot;
        updateFutureFundingRate();
    }

    /**
     * @dev Updates the future funding rate.
     * @return An integer representing the updated funding rate.
     */
    function updateFutureFundingRate() internal returns (int) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        int _newFundingRate = calculateFundingRate(
            int(getAssetPrice()),
            int(indexPrice)
        );
        console.log("new funding rate 111", uint(_newFundingRate * -1));
        lastSnapshot.fundingRate = _newFundingRate;
        liquidityChangedSnapshots[
            liquidityChangedSnapshots.length - 1
        ] = lastSnapshot;

        return _newFundingRate;
    }

    /**
     * @dev Calculates the funding rate based on mark price and index price.
     * @param markPrice The mark price of the asset.
     * @param _indexPrice The index price of the asset.
     * @return An integer representing the calculated funding rate.
     */
    function calculateFundingRate(
        int markPrice,
        int _indexPrice
    ) public pure returns (int) {
        return intToFixed(_indexPrice - markPrice) / _indexPrice / 12;
    }

    //only exchange
    /**
     * @dev Closes a position.
     * @param positionSize The size of the position to be closed.
     * @return exitPrice The price at which the position was closed.
     * @return usdcAmt The USDC amount of the closed position.
     */
    function closePosition(
        int positionSize,
        int side
    ) external returns (uint exitPrice, int usdcAmt) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        lastSnapshot.totalPositionSize -= positionSize;
        int quoteWPsz = int(lastSnapshot.quoteAssetReserve) + (positionSize);

        uint newBaseAsset = uint(intToFixed(int(k)) / quoteWPsz);

        usdcAmt = (int(lastSnapshot.baseAssetReserve) - int(newBaseAsset));
        usdcAmt > 0 ? usdcAmt *= 1 : usdcAmt *= -1;
        console.log("VAMM: usdc AMT", uint(usdcAmt));
        lastSnapshot.cumulativeNotional -= usdcAmt;
        lastSnapshot.quoteAssetReserve = uint(quoteWPsz);
        lastSnapshot.baseAssetReserve = newBaseAsset;
        absolutePositionSize -= uint(positionSize* side);
        liquidityChangedSnapshots[
            liquidityChangedSnapshots.length - 1
        ] = lastSnapshot;

        exitPrice = uint(intToFixed(int(usdcAmt)) / (positionSize));

        updateFutureFundingRate();
        absolutePositionSize==0? isFrozen = true : isFrozen = false;
    }


    function getClosePosition(
        int positionSize
    ) external view returns ( int usdcAmt) {
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        lastSnapshot.totalPositionSize -= positionSize;
        int quoteWPsz = int(lastSnapshot.quoteAssetReserve) + (positionSize);

        uint newBaseAsset = uint(intToFixed(int(k)) / quoteWPsz);

        usdcAmt = (int(lastSnapshot.baseAssetReserve) - int(newBaseAsset));
        usdcAmt > 0 ? usdcAmt : usdcAmt *= -1;
    }

    /**
     * @dev Adjusts funding payments for all positions.
     */
    function adjustFundingPaymentsAll() internal {
        updateFutureFundingRate();
        LiquidityChangedSnapshot
            memory lastSnapshot = liquidityChangedSnapshots[
                liquidityChangedSnapshots.length - 1
            ];
        // int nbR =  int(lastSnapshot.baseAssetReserve) *(100000000+lastSnapshot.fundingRate);
        // uint _newBaseAsset = uint(fixedToInt(nbR>0?nbR:nbR*-1));
        // uint _newQuoteAsset = k/ _newBaseAsset;
        lastSnapshot.quoteAssetReserve = lastSnapshot.quoteAssetReserve;
        lastSnapshot.baseAssetReserve = lastSnapshot.baseAssetReserve;
        lastSnapshot.blockNumber = block.number;
        lastSnapshot.timestamp = block.timestamp;
        lastSnapshot.startIndexPrice = lastSnapshot.finalIndexPrice;
        lastSnapshot.finalIndexPrice = 0;
        liquidityChangedSnapshots.push(lastSnapshot);
        lastFundingRateIndex = liquidityChangedSnapshots.length - 1;
        updateFutureFundingRate();
    }

    /**
     * @dev Converts an integer to a fixed-point representation.
     * @param y The integer to be converted.
     * @return x The fixed-point representation of the input integer.
     */
    function intToFixed(int y) public pure returns (int x) {
        return y * (10 ** 8);
    }

    /**
     * @dev Converts a fixed-point representation to an integer.
     * @param x The fixed-point representation to be converted.
     * @return y The integer representation of the input fixed-point number.
     */
    function fixedToInt(int x) public pure returns (int y) {
        return x / (10 ** 8);
    }
}
