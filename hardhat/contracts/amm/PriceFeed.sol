// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import '../../node_modules/@redstone-finance/evm-connector/contracts/data-services/StocksDemoConsumerBase.sol';

contract PriceFeed is StocksDemoConsumerBase{

  function getStockPrice(bytes32 _dataFeedId) public view returns (uint256) {
   return getOracleNumericValueFromTxMsg(_dataFeedId);
  }       

}