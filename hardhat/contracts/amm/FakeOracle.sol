// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@redstone-finance/evm-connector/contracts/data-services/StocksDemoConsumerBase.sol";

contract PriceFeed is StocksDemoConsumerBase{

  uint public price;

  function getStockPrice(bytes32 _dataFeedId) public view returns (uint256) {
   return getOracleNumericValueFromTxMsg(_dataFeedId);
  }       

  function getStockPriceLabel(bytes32 _dataFeedId) public  {
   price = getOracleNumericValueFromTxMsg(_dataFeedId);
  }     
  function getPrice() public view returns (uint256) {
   return price;
  }

}