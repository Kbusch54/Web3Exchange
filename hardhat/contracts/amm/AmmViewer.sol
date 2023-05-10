// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AmmViewer{
    mapping(address => bool) public isAmm;
    function getAmmStates(address[] memory ammAddrs) external view returns (uint256[] memory){
        uint256[] memory states = new uint256[](ammAddrs.length);
        for(uint256 i = 0; i < ammAddrs.length; i++){
            states[i] = 0;
        }
        return states;
    }
    modifier isAmmContract(address ammAddr) {
        require(isAmm[ammAddr], "not amm contract");
        _;
    }

}