// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";
import "../../node_modules/@redstone-finance/evm-connector/contracts/data-services/StocksDemoConsumerBase.sol";

// import "../../node_modules/@redstone-finance/evm-connector/dist/contracts/data-services/AvalancheDataServiceConsumerBase.sol";

contract FakeOracle is StocksDemoConsumerBase{
    uint public price;
    constructor(uint _price){
        price = _price;
    }
    function setPrice(uint _price)public{
        price = _price;
    }
    function getLatestTslaPrice() public view returns (uint256) {
    bytes32 dataFeedId = bytes32("TSLA");
    return getOracleNumericValueFromTxMsg(dataFeedId);
  }
  function getLatestGoogPrice() public view returns (uint256) {
    bytes32 dataFeedId = bytes32("GOOG");
    return getOracleNumericValueFromTxMsg(dataFeedId);
  }
  function getLatestMetaPrice() public view returns (uint256) {
    bytes32 dataFeedId = bytes32("META");
    return getOracleNumericValueFromTxMsg(dataFeedId);
  }
  function getStockPrice(bytes32 _dataFeedId) public view returns (uint256) {
    return getOracleNumericValueFromTxMsg(_dataFeedId);
  }
}