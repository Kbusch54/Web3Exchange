// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Balances.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../Interfaces/IStakingPoolAmm.sol";
import "hardhat/console.sol";
// import "@eth-contract/log" for bytes32;

contract VaultForLoanPools is Balances{

    event LogBytes(bytes data);
    constructor(address _usdc,address[] memory _pools)Balances(_usdc){
         Pools = _pools;
    }
    address[] public Pools;
    uint public lastRewardIndex;
     function getInterestOwed(bytes memory  _tradeId)public view returns(uint){
        (, , , ,address _pool)=decodeTradeId(_tradeId);
        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        return stake.getInterestOwedForAmount(_tradeId,tradeBalance[_tradeId]);
    }

   

     function recordInterest(bytes memory _tradeId,uint _amount)internal returns(bool){
        //liquidate if not enough collateral
        require(tradeCollateral[_tradeId] >= _amount,"not enough collateral");
        ( , , , ,address _pool )=decodeTradeId(_tradeId);

        IStakingPoolAmm stake = IStakingPoolAmm(_pool);
        uint indexForStore = stake.updateAndGetCurrentIndex();
        tradeCollateral[_tradeId] -= _amount;
        // totalTradeCollateral[trader] -= _amount;
        uint _amt = _amount;
        uint half = _amt/2;
        _amt -= half;
        IERC20(Usdc).approve(_pool,half);
        balancesForRewards[_pool][indexForStore] += _amt;
        require(stake.takeInterest(half,_amount),'interest not taken');
        return true;
    }

    //only for pools to take rewards
    function takeReward(uint _amount,address _staker,uint rewardsIndex)public{
        checkTakeReward(msg.sender,rewardsIndex);
        balancesForRewards[msg.sender][rewardsIndex] -= _amount;
        IERC20(Usdc).transfer(_staker,_amount);
        lastRewardIndex = rewardsIndex;

    }
    function checkTakeReward(address _pool,uint rewardsIndex)public{
        if(rewardsIndex>lastRewardIndex){
            for(uint i = lastRewardIndex;i<rewardsIndex;i++){
                if(balancesForRewards[_pool][i]>0){
                    IERC20(Usdc).transfer(_pool,balancesForRewards[_pool][i]);
                }
            }
        }    
    }

    function decodeTradeId(bytes memory encodedData) public pure returns(address amm, uint timeStamp, int side, address trader,address pool ) {
    ( amm,  timeStamp, side,trader,pool) =  abi.decode((encodedData), (address, uint, int, address,address)); 
}




}