// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title PoolTokens
 * @dev A custom ERC1155 token implementation for a pool-based staking system.
 */
contract PoolTokens is Context, ERC1155{
        string private constant _uri = "ipfs://your_token_uri_here/";
        address private staking;
        uint8 public constant decimals = 18;

        mapping(uint=> uint) public totalSupplyTok;
  /**
     * @dev Contract constructor.
     * @param _staking Address of the staking contract.
     */
    constructor(address _staking) ERC1155(_uri){
        staking = _staking;
    }

    modifier onlyStaking {
        require(_msgSender() == staking, "Only staking contract");
        _;
        
    }
   /**
     * @dev Function to mint tokens proportionally based on staking.
     * @param account Address of the account to receive the minted tokens.
     * @param id Token ID.
     * @param proportionAmt Proportional amount of tokens to be minted.
     * @return A boolean value indicating whether the operation succeeded.
     */
    function stakeMint(address account, uint256 id, uint256 proportionAmt) public onlyStaking returns(bool){
        uint _totalSupplyTok = totalSupplyTok[id]>0?totalSupplyTok[id]:1;
        uint _mintAmount = _totalSupplyTok * proportionAmt;
        _mint(account, id, _mintAmount, '');
        totalSupplyTok[id] += _mintAmount;
        return true;
    }
   /**
     * @dev Function to mint tokens.
     * @param account Address of the account to receive the minted tokens.
     * @param id Token ID.
     * @param amount Amount of tokens to be minted.
     * @param data Additional data passed to the mint function.
     */
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyStaking{
        uint _mintAmount = amount*10**decimals;
        _mint(account, id, _mintAmount, data);
        totalSupplyTok[id] += _mintAmount;
    }

    /**
     * @dev Function to burn tokens.
     * @param account Address of the account holding the tokens to be burned.
     * @param id Token ID.
     * @param amount Amount of tokens to be burned.
     * @return A boolean value indicating whether the operation succeeded.
     */
    function burn(address account, uint256 id, uint256 amount) public onlyStaking returns(bool){
        _burn(account, id, amount);
        totalSupplyTok[id] -= amount;
        return true;
    }

   /**
     * @dev Function to burn multiple tokens in a batch.
     * @param account Address of the account holding the tokens to be burned.
     * @param ids Array of token IDs.
     * @param amounts Array of amounts to be burned for each respective token ID.
     */
    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) public onlyStaking{
        _burnBatch(account, ids, amounts);
        for(uint i = 0; i < ids.length; i++){
            totalSupplyTok[ids[i]] -= amounts[i];
        }
    }
 /**
     * @dev Function to get the token URI.
     * @param id Token ID.
     * @return A string representing the token URI.
     */
    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), ".json"));
    }
 /**
     * @dev Function to check if the contract supports a specific interface.
     * @param interfaceId Interface identifier.
     * @return A boolean value indicating whether the contract supports the given interface.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setStaking(address _staking) public onlyStaking{
        staking = _staking;
    }

    

}