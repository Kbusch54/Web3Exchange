// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IERC20 interface from the OpenZeppelin library
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Balances
 * @dev A contract for managing user balances and trade-related data.
 */
contract Balances {
    // Store the address of the USDC token contract
    address Usdc;

    /**
     * @dev Constructor takes the USDC token contract address as an argument.
     * @param _usdc The address of the USDC token contract.
     */
    constructor(address _usdc) {
        Usdc = _usdc;
    }

    // Mappings for storing trade balances, collaterals, interests, available balances, and total trade collaterals
    mapping(bytes => uint) public tradeBalance;
    mapping(bytes => uint) public tradeCollateral;
    mapping(bytes => uint) public tradeInterest;
    mapping(address => uint) public availableBalance;
    mapping(address => uint) public totalTradeCollateral; // For liquidation purposes

        // Mappings for storing pool-related data
    mapping(address => uint) public poolTotalUsdcSupply;
    mapping(address => uint) public poolOutstandingLoans;
    mapping(address => uint) public poolAvailableUsdc;


  mapping(address => bool) public isAmmPool;
    /**
     * @dev Function for depositing USDC tokens into the contract.
     * @param _amount The amount of USDC tokens to deposit.
     */
    function deposit(uint _amount) public {
        require(IERC20(Usdc).balanceOf(msg.sender) >= _amount, "not enough balance");
        require(IERC20(Usdc).transferFrom(msg.sender, address(this), _amount), 'transfer failed');
        availableBalance[msg.sender] += _amount;
    }

    /**
     * @dev Function for withdrawing USDC tokens from the contract.
     * @param _amount The amount of USDC tokens to withdraw.
     */
    function withdraw(uint _amount) public {
        require(availableBalance[msg.sender] >= _amount, "not enough balance");
        IERC20(Usdc).transfer(msg.sender, _amount);
        availableBalance[msg.sender] -= _amount;
    }
    function addLoanPool(address _pool) public {
        require(!isAmmPool[_pool], "pool already added");
        isAmmPool[_pool] = true;
    }

} 