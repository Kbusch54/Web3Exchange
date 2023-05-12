// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./PriceFeed.sol";
import "./Payload.sol";

contract CallerContract{
    uint public price;

    function getGoogPrice(address _ammAddr) public view returns (uint256) {
        return PriceFeed(_ammAddr).getStockPrice(0x474f4f4700000000000000000000000000000000000000000000000000000000);
    }
    function getTeslaPrice(address _ammAddr) public view returns (uint256) {
        return PriceFeed(_ammAddr).getStockPrice(0x54534c4100000000000000000000000000000000000000000000000000000000);
    }
    function getRandomPrice(address _ammAddr,bytes32  _stock) public  {
        price = PriceFeed(_ammAddr).getStockPrice(_stock);
    }
    function getPrice() public view returns (uint256) {
        return price;
    }

    function getPriceValue(address _payloadAddr,bytes32 _stock,bytes calldata redstonePayload ) public view returns (uint256) {
        return Payload(_payloadAddr).getLatestPrice(redstonePayload,_stock);
    }
       

}