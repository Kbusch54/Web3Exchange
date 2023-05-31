// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./PoolTokens.sol";

contract StakingHelper{
    address public pt;

    constructor(address _pt) {
        pt = _pt;
    }


 function getProportionOfVotes(address[] memory _signers,uint _tokenId,uint _maxVotingPower, uint _minVotingPower) public view returns(uint) {
        uint _totalVotes = 0;
        uint _totalSupply = getTotalSupply(_tokenId);
        for (uint i = 0; i < _signers.length; i++) {
             uint _currentVote = PoolTokens(pt).balanceOf(_signers[i],_tokenId);
            if (_totalVotes > _maxVotingPower) {
                _totalVotes = _maxVotingPower;
            }else if(_totalVotes < _minVotingPower) {
                _totalVotes+=0;
            }
            if(_totalVotes * 10**6<_totalSupply){
                _totalVotes+=0;
            }
            _totalVotes += (_currentVote*10**6)/_totalSupply;
        }
        return _totalVotes;
    }

    function getTotalSupply(uint _tokenId) public view returns (uint) {
        return PoolTokens(pt).totalSupplyTok(_tokenId);
    }

}