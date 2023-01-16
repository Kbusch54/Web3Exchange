// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVAmm {


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

    function init(address _assest, string memory _path,uint _indexPrice,uint _quoteAssetAmount,uint8 _indexPricePeriod)external;

    function openPosition(uint totalCollateral,int _side)external returns(int positionSize,uint avgEntryPrice,uint openValue);
    function closePosition(int positionSize,int _side)external returns(uint exitPrice,int usdcAmt);
    


        function getLiquidityChangedSnapshots()external view returns(LiquidityChangedSnapshot[] memory);
        function getLastSnapshot()external view returns(LiquidityChangedSnapshot memory);

    //price
    
    function setIndexPrice(uint _price)external;
    function getAssetPrice() external view returns(uint priceInUSDC);
    function getLastAssetSpotPrice()external view returns(uint);
    function getQuoteReserve()external view returns(uint);


    //funding rate
     function adjustFundingPaymentsAll()external;
    function getFutureFundingRate() external view returns(int);




}
    // event PositionChanged(
    //     address indexed trader,
    //     address indexed amm,
    //     uint256 margin,
    //     uint256 positionNotional,
    //     int256 exchangedPositionSize,
    //     uint256 fee,
    //     int256 positionSizeAfter,
    //     int256 realizedPnl,
    //     int256 unrealizedPnlAfter,
    //     uint256 badDebt,
    //     uint256 liquidationPenalty,
    //     uint256 spotPrice,
    //     int256 fundingPayment
    // );
    /// @notice This struct records personal position information
    /// @param size denominated in amm.baseAsset
    /// @param margin isolated margin
    /// @param openNotional the quoteAsset value of position when opening position. the cost of the position
    /// @param lastUpdatedCumulativePremiumFraction for calculating funding payment, record at the moment every time when trader open/reduce/close position
    /// @param liquidityHistoryIndex
    /// @param blockNumber the block number of the last position
    // struct Position {
    //     SignedDecimal.signedDecimal size;
    //     Decimal.decimal margin;
    //     Decimal.decimal openNotional;
    //     SignedDecimal.signedDecimal lastUpdatedCumulativePremiumFraction;
    //     uint256 liquidityHistoryIndex;
    //     uint256 blockNumber;
    // }

    //     /// @notice This struct is used for avoiding stack too deep error when passing too many var between functions
    // struct PositionResp {
    //     Position position;
    //     // the quote asset amount trader will send if open position, will receive if close
    //     Decimal.decimal exchangedQuoteAssetAmount;
    //     // if realizedPnl + realizedFundingPayment + margin is negative, it's the abs value of it
    //     Decimal.decimal badDebt;
    //     // the base asset amount trader will receive if open position, will send if close
    //     SignedDecimal.signedDecimal exchangedPositionSize;
    //     // funding payment incurred during this position response
    //     SignedDecimal.signedDecimal fundingPayment;
    //     // realizedPnl = unrealizedPnl * closedRatio
    //     SignedDecimal.signedDecimal realizedPnl;
    //     // positive = trader transfer margin to vault, negative = trader receive margin from vault
    //     // it's 0 when internalReducePosition, its addedMargin when internalIncreasePosition
    //     // it's min(0, oldPosition + realizedFundingPayment + realizedPnl) when internalClosePosition
    //     SignedDecimal.signedDecimal marginToVault;
    //     // unrealized pnl after open position
    //     SignedDecimal.signedDecimal unrealizedPnlAfter;
    // }
    
    
    /**
     * @notice add margin to increase margin ratio
     * @param _amm IAmm address
     * @param _addedMargin added margin in 18 digits
     */
    // function addMargin(IAmm _amm, Decimal.decimal calldata _addedMargin) external whenNotPaused() nonReentrant() {
    //     // check condition
    //     requireAmm(_amm, true);
    //     IERC20 quoteToken = _amm.quoteAsset();
    //     requireValidTokenAmount(quoteToken, _addedMargin);

    //     address trader = _msgSender();
    //     Position memory position = getPosition(_amm, trader);
    //     // update margin
    //     position.margin = position.margin.addD(_addedMargin);

    //     setPosition(_amm, trader, position);
    //     // transfer token from trader
    //     _transferFrom(quoteToken, trader, address(this), _addedMargin);
    //     emit MarginChanged(trader, address(_amm), int256(_addedMargin.toUint()), 0);
    // }

    /**
     * @notice remove margin to decrease margin ratio
     * @param _amm IAmm address
     * @param _removedMargin removed margin in 18 digits
     */
    // function removeMargin(IAmm _amm, Decimal.decimal calldata _removedMargin) external whenNotPaused() nonReentrant() {
    //     // check condition
    //     requireAmm(_amm, true);
    //     IERC20 quoteToken = _amm.quoteAsset();
    //     requireValidTokenAmount(quoteToken, _removedMargin);

    //     address trader = _msgSender();
    //     // realize funding payment if there's no bad debt
    //     Position memory position = getPosition(_amm, trader);

    //     // update margin and cumulativePremiumFraction
    //     SignedDecimal.signedDecimal memory marginDelta = MixedDecimal.fromDecimal(_removedMargin).mulScalar(-1);
    //     (
    //         Decimal.decimal memory remainMargin,
    //         Decimal.decimal memory badDebt,
    //         SignedDecimal.signedDecimal memory fundingPayment,
    //         SignedDecimal.signedDecimal memory latestCumulativePremiumFraction
    //     ) = calcRemainMarginWithFundingPayment(_amm, position, marginDelta);
    //     require(badDebt.toUint() == 0, "margin is not enough");
    //     position.margin = remainMargin;
    //     position.lastUpdatedCumulativePremiumFraction = latestCumulativePremiumFraction;

    //     // check enough margin (same as the way Curie calculates the free collateral)
    //     // Use a more conservative way to restrict traders to remove their margin
    //     // We don't allow unrealized PnL to support their margin removal
    //     require(
    //         calcFreeCollateral(_amm, trader, remainMargin.subD(badDebt)).toInt() >= 0,
    //         "free collateral is not enough"
    //     );

    //     setPosition(_amm, trader, position);

    //     // transfer token back to trader
    //     withdraw(quoteToken, trader, _removedMargin);
    //     emit MarginChanged(trader, address(_amm), marginDelta.toInt(), fundingPayment.toInt());
    // }






    // /**
    //  * @notice open a position
    //  * @param _amm amm address
    //  * @param _side enum Side; BUY for long and SELL for short
    //  * @param _quoteAssetAmount quote asset amount in 18 digits. Can Not be 0
    //  * @param _leverage leverage  in 18 digits. Can Not be 0
    //  * @param _baseAssetAmountLimit minimum base asset amount expected to get to prevent from slippage.
    //  */
    // function openPosition(
    //     IAmm _amm,
    //     Side _side,
    //     Decimal.decimal memory _quoteAssetAmount,
    //     Decimal.decimal memory _leverage,
    //     Decimal.decimal memory _baseAssetAmountLimit
    // ) public whenNotPaused() nonReentrant() {
    //     requireAmm(_amm, true);
    //     IERC20 quoteToken = _amm.quoteAsset();
    //     requireValidTokenAmount(quoteToken, _quoteAssetAmount);
    //     requireNonZeroInput(_leverage);
    //     requireMoreMarginRatio(MixedDecimal.fromDecimal(Decimal.one()).divD(_leverage), initMarginRatio, true);
    //     requireNotRestrictionMode(_amm);

    //     address trader = _msgSender();
    //     PositionResp memory positionResp;
    //     {
    //         // add scope for stack too deep error
    //         int256 oldPositionSize = getPosition(_amm, trader).size.toInt();
    //         bool isNewPosition = oldPositionSize == 0 ? true : false;

    //         // increase or decrease position depends on old position's side and size
    //         if (isNewPosition || (oldPositionSize > 0 ? Side.BUY : Side.SELL) == _side) {
    //             positionResp = internalIncreasePosition(
    //                 _amm,
    //                 _side,
    //                 _quoteAssetAmount.mulD(_leverage),
    //                 _baseAssetAmountLimit,
    //                 _leverage
    //             );
    //         } else {
    //             positionResp = openReversePosition(
    //                 _amm,
    //                 _side,
    //                 trader,
    //                 _quoteAssetAmount,
    //                 _leverage,
    //                 _baseAssetAmountLimit,
    //                 false
    //             );
    //         }

    //         // update the position state
    //         setPosition(_amm, trader, positionResp.position);
    //         // if opening the exact position size as the existing one == closePosition, can skip the margin ratio check
    //         if (!isNewPosition && positionResp.position.size.toInt() != 0) {
    //             requireMoreMarginRatio(getMarginRatio(_amm, trader), maintenanceMarginRatio, true);
    //         }

    //         // to prevent attacker to leverage the bad debt to withdraw extra token from insurance fund
    //         require(positionResp.badDebt.toUint() == 0, "bad debt");

    //         // transfer the actual token between trader and vault
    //         if (positionResp.marginToVault.toInt() > 0) {
    //             _transferFrom(quoteToken, trader, address(this), positionResp.marginToVault.abs());
    //         } else if (positionResp.marginToVault.toInt() < 0) {
    //             withdraw(quoteToken, trader, positionResp.marginToVault.abs());
    //         }
    //     }

    //     // calculate fee and transfer token for fees
    //     //@audit - can optimize by changing amm.swapInput/swapOutput's return type to (exchangedAmount, quoteToll, quoteSpread, quoteReserve, baseReserve) (@wraecca)
    //     Decimal.decimal memory transferredFee = transferFee(trader, _amm, positionResp.exchangedQuoteAssetAmount);

    //     // emit event
    //     uint256 spotPrice = _amm.getSpotPrice().toUint();
    //     int256 fundingPayment = positionResp.fundingPayment.toInt(); // pre-fetch for stack too deep error
    //     emit PositionChanged(
    //         trader,
    //         address(_amm),
    //         positionResp.position.margin.toUint(),
    //         positionResp.exchangedQuoteAssetAmount.toUint(),
    //         positionResp.exchangedPositionSize.toInt(),
    //         transferredFee.toUint(),
    //         positionResp.position.size.toInt(),
    //         positionResp.realizedPnl.toInt(),
    //         positionResp.unrealizedPnlAfter.toInt(),
    //         positionResp.badDebt.toUint(),
    //         0,
    //         spotPrice,
    //         fundingPayment
    //     );
    // }




    // /**
    //  * @notice close all the positions
    //  * @param _amm IAmm address
    //  */
    // function closePosition(IAmm _amm, Decimal.decimal memory _quoteAssetAmountLimit)
    //     public
    //     whenNotPaused()
    //     nonReentrant()
    // {
    //     // check conditions
    //     requireAmm(_amm, true);
    //     requireNotRestrictionMode(_amm);

    //     // update position
    //     address trader = _msgSender();

    //     PositionResp memory positionResp;
    //     {
    //         Position memory position = getPosition(_amm, trader);
    //         // if it is long position, close a position means short it(which means base dir is ADD_TO_AMM) and vice versa
    //         IAmm.Dir dirOfBase = position.size.toInt() > 0 ? IAmm.Dir.ADD_TO_AMM : IAmm.Dir.REMOVE_FROM_AMM;

    //         // check if this position exceed fluctuation limit
    //         // if over fluctuation limit, then close partial position. Otherwise close all.
    //         // if partialLiquidationRatio is 1, then close whole position
    //         if (
    //             _amm.isOverFluctuationLimit(dirOfBase, position.size.abs()) &&
    //             partialLiquidationRatio.cmp(Decimal.one()) < 0
    //         ) {
    //             Decimal.decimal memory partiallyClosedPositionNotional =
    //                 _amm.getOutputPrice(dirOfBase, position.size.mulD(partialLiquidationRatio).abs());

    //             positionResp = openReversePosition(
    //                 _amm,
    //                 position.size.toInt() > 0 ? Side.SELL : Side.BUY,
    //                 trader,
    //                 partiallyClosedPositionNotional,
    //                 Decimal.one(),
    //                 Decimal.zero(),
    //                 true
    //             );
    //             setPosition(_amm, trader, positionResp.position);
    //         } else {
    //             positionResp = internalClosePosition(_amm, trader, _quoteAssetAmountLimit);
    //         }

    //         // to prevent attacker to leverage the bad debt to withdraw extra token from insurance fund
    //         require(positionResp.badDebt.toUint() == 0, "bad debt");

    //         // add scope for stack too deep error
    //         // transfer the actual token from trader and vault
    //         IERC20 quoteToken = _amm.quoteAsset();
    //         withdraw(quoteToken, trader, positionResp.marginToVault.abs());
    //     }

    //     // calculate fee and transfer token for fees
    //     Decimal.decimal memory transferredFee = transferFee(trader, _amm, positionResp.exchangedQuoteAssetAmount);

    //     // prepare event
    //     uint256 spotPrice = _amm.getSpotPrice().toUint();
    //     int256 fundingPayment = positionResp.fundingPayment.toInt();
    //     emit PositionChanged(
    //         trader,
    //         address(_amm),
    //         positionResp.position.margin.toUint(),
    //         positionResp.exchangedQuoteAssetAmount.toUint(),
    //         positionResp.exchangedPositionSize.toInt(),
    //         transferredFee.toUint(),
    //         positionResp.position.size.toInt(),
    //         positionResp.realizedPnl.toInt(),
    //         positionResp.unrealizedPnlAfter.toInt(),
    //         positionResp.badDebt.toUint(),
    //         0,
    //         spotPrice,
    //         fundingPayment
    //     );
    // }