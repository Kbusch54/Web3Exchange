// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@Openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Balances.sol";

contract VaultForLoanPool is Balances{
    constructor(address _usdc,address[] calldata _pools)Balances(_usdc){
         Pools = _pool;
    }
    address[] public Pools;
     function getInterestOwed(bytes32 _tradeId)public view returns(uint){
        (address _pool, , , )=decodeTradeId(_tradeId);
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        return stake.getInterestOwedForAmount(_tradeId,tradeBalance[_tradeId]);
    }

   

     function recordInterest(bytes32 _tradeId,uint _amount)internal returns(bool){
        //liquidate if not enough collateral
        require(tradeCollateral[_tradeId] >= _amount,"not enough collateral");
        (address _pool, , , address trader )=decodeTradeId(_tradeId);
        require(totalTradeCollateral[trader] >= _amount,"not enough collateral");
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        uint indexForStore = stake.updateAndGetCurrentIndex();
        tradeCollateral[_tradeId] -= _amount;
        totalTradeCollateral[trader] -= _amount;
        uint _amt = _amount;
        uint half = _amt/2;
        _amt -= half;
        IERC20(Usdc).approve(_pool,half);
        balancesForRewards[_pool][indexForStore] += _amt;
        stake.takeInterest(half,_amount);
        return true;
    }

    //only for pools to take rewards
    function takeReward(uint _amount,address _staker,uint rewardsIndex)public{
        checkTakeReward(msg.sender,rewardsIndex);
        balancesForRewards[msg.sender][rewardsIndex] -= _amount;
        IERC20(Usdc).transfer(_staker,_amount);

    }
    function checkTakeReward(address _staker,uint rewardsIndex)internal{
         if(balancesForRewards[_staker][rewardsIndex-1]>0){
            balancesForRewards[_staker][rewardsIndex]+=balancesForRewards[_staker][rewardsIndex-1];
         }
    }

    function decodeTradeId(bytes memory encodedData) public pure returns (address pool, uint timeStamp, int side, address trader ) {
    ( pool,  timeStamp, side,trader) = abi.decode(encodedData, (address, uint, int, address));
}



}