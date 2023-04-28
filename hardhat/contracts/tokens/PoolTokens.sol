// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Context.sol";

contract PoolTokens is Context, ERC1155{
        string private constant _uri = "ipfs://your_token_uri_here/";
        address private staking;
        uint8 public constant decimals = 18;

        mapping(uint=> uint) public totalSupplyTok;
    constructor(address _staking) ERC1155(_uri){
        staking = _staking;
    }

    modifier onlyStaking {
        require(_msgSender() == staking, "Only staking contract");
        _;
        
    }

    function stakeMint(address account, uint256 id, uint256 proportionAmt) public onlyStaking returns(bool){
        uint _totalSupplyTok = totalSupplyTok[id]>0?totalSupplyTok[id]:1;
        uint _mintAmount = _totalSupplyTok * proportionAmt;
        _mint(account, id, _mintAmount, '');
        totalSupplyTok[id] += _mintAmount;
        return true;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyStaking{
        uint _mintAmount = amount*10**decimals;
        _mint(account, id, _mintAmount, data);
        totalSupplyTok[id] += _mintAmount;
    }

    function burn(address account, uint256 id, uint256 amount) public onlyStaking returns(bool){
        _burn(account, id, amount);
        totalSupplyTok[id] -= amount;
        return true;
    }

    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) public onlyStaking{
        _burnBatch(account, ids, amounts);
        for(uint i = 0; i < ids.length; i++){
            totalSupplyTok[ids[i]] -= amounts[i];
        }
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), ".json"));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setStaking(address _staking) public onlyStaking{
        staking = _staking;
    }

    

}