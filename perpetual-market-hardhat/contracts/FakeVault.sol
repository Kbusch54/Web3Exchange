// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./tokens/IStakingPoolAmm.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";
contract FakeVault{

    address Usdc;
    address Pool;

    mapping(address=>mapping(uint=>uint)) public balancesForRewards;

    constructor(address _usdc,address _stakingPoolAmm){
        Usdc = _usdc;
        Pool = _stakingPoolAmm;
    }
    function recordInterest(uint _amount)public{
        require(IERC20(Usdc).balanceOf(msg.sender) >= _amount,"not enough balance");
        IStakingPoolAmm stake = IStakingPoolAmm(Pool);
        uint indexForStore = stake.updateAndGetCurrentIndex();
        IERC20(Usdc).transferFrom(msg.sender,address(this),_amount);
        IERC20(Usdc).approve(Pool,_amount/2);
        balancesForRewards[Pool][indexForStore] += _amount/2;
        stake.takeInterest(_amount/2);
    }
    function takeReward(uint _amount,address _staker,uint rewardsIndex)public{
        balancesForRewards[msg.sender][rewardsIndex] -= _amount;
        IERC20(Usdc).transfer(_staker,_amount);
    }
}