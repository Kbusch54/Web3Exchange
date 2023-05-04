// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FakeOracle{
    uint public price;
    constructor(uint _price){
        price = _price;
    }
    function setPrice(uint _price)public{
        price = _price;
    }
}