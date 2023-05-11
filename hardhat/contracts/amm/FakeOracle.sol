// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";
import "../../node_modules/@redstone-finance/evm-connector/contracts/data-services/StocksDemoConsumerBase.sol";

// import "../../node_modules/@redstone-finance/evm-connector/dist/contracts/data-services/AvalancheDataServiceConsumerBase.sol";

contract FakeOracle is StocksDemoConsumerBase{
  function getStockPrice(bytes32 _dataFeedId) public view returns (uint256) {
   return getOracleNumericValueFromTxMsg(_dataFeedId);
  }       
}