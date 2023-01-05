// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Vault {
    using SafeMath for uint256;
    using Address for address;

    // Define the address of the contract owner
    address public owner;

//Define address for collateral
address public collateral;
    // Define the mapping to store the balance of each user
    mapping(address => uint256) public totalBalance;
    // Define the mapping to store the balance of each user

    // Define the mapping to store the debt of each user
    mapping(address => uint256) public debt;

    // Define the mapping to store the available collateral of each user
    mapping(address => uint256) public availableCollateral;

        // Define the mapping to store if user is frozen
    mapping(address => bool) public isFrozen;

    // Define the constructor to initialize the owner
    constructor(address _collateral)  {
        owner = msg.sender;
        collateral = _collateral;
    }

    // Define the function to allow users to deposit funds
    function depositCollateral(uint256 value) public {
        IERC20 erc20 = IERC20(collateral);
        require(erc20.allowance(msg.sender, address(this)) >= value, "Insufficient allowance");
        erc20.transferFrom(msg.sender, address(this), value);
        totalBalance[msg.sender] += value;


//may need calculation
            availableCollateral[msg.sender] += value;
    }

    // Define the function to allow users to withdraw funds
    function withdrawCollateral(uint256 value) public {
           require(value > 0, "The value must be greater than zero");
        // Check the balance of the user for the ERC20 token
        require(value <= totalBalance[msg.sender], "Insufficient balance");
        // Transfer the ERC20 tokens from the contract to the caller
        IERC20 erc20 = IERC20(collateral);
        erc20.transfer(msg.sender, value);
        // Update the balance of the user for the ERC20 token
        totalBalance[msg.sender] -= value;


        //may need calculation
        availableCollateral[msg.sender] -= value;
    }


    // Define the function to allow the owner to transfer the funds of a user to another address
    function transfer(address from, address to, uint256 value) public {
        require(msg.sender == owner, "Only the owner can transfer the funds of a user");
        require(value <= totalBalance[from], "Insufficient balance");
        totalBalance[from] -= value;
        totalBalance[to] += value;
    }

    // Define the function to allow the owner to transfer all the funds of a user to another address
    function transferAll(address from, address to) public {
        require(msg.sender == owner, "Only the owner can transfer all the funds of a user");
        uint256 value = totalBalance[from];
        totalBalance[from] = 0;
        totalBalance[to] += value;
    }

    // Define the function to allow the owner to freeze the account of a user
    function freezeAccount(address user) public {
        require(msg.sender == owner, "Only the owner can freeze accounts");
            require(totalBalance[user] == 0, "The balance of the user must be zero");
    isFrozen[user] = true;
}

// Define the function to allow the owner to unfreeze the account of a user
function unfreezeAccount(address user) public {
    require(msg.sender == owner, "Only the owner can unfreeze accounts");
    // require(!address(totalBalance[user]).isContract(), "The account is not frozen");
    isFrozen[user] = false;
}

// Define the function to allow the owner to transfer the ownership of the contract
function transferOwnership(address newOwner) public {
    require(msg.sender == owner, "Only the owner can transfer the ownership of the contract");
    require(newOwner != address(0), "The new owner cannot be the zero address");
    owner = newOwner;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Exchangefunctions /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}
