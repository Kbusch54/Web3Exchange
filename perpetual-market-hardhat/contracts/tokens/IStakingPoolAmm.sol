// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IStakingPoolAmm{
    function takeInterest(uint _amount) external;
    function getCurrentindex() external view returns(uint);
    function updateAndGetCurrentIndex() external returns(uint);
}
    