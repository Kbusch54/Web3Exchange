// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IERC20 interface from the OpenZeppelin library
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../daos/TheseusDAO.sol";

/**
 * @title Balances
 * @dev A contract for managing user balances and trade-related data.
 */
contract Balances {
    // Store the address of the USDC token contract
    address Usdc;
  address public loanPool;
    address public theseusDao;

    /**
     * @dev Constructor takes the USDC token contract address as an argument.
     * @param _usdc The address of the USDC token contract.
     */
    constructor(address _usdc) {
        Usdc = _usdc;
    }

    function _onlyTheseusDao() private view {
    require(msg.sender == theseusDao,'not theseusDao');
}
  modifier onlyTheseusDao {
        _onlyTheseusDao();
        _;
    }
 function updateTheseus(address _theseusDao) public onlyTheseusDao {
        theseusDao = _theseusDao;
    }
    // Mappings for storing trade balances, collaterals, interests, available balances, and total trade collaterals
    mapping(bytes => uint) public tradeBalance;
    mapping(bytes => uint) public tradeCollateral;
    mapping(address => uint) public availableBalance;

        // Mappings for storing pool-related data
    mapping(address => uint) public poolTotalUsdcSupply;
    mapping(address => uint) public poolOutstandingLoans;
    mapping(address => uint) public poolAvailableUsdc;


  mapping(address => bool) public isAmm;


  
    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);
    /**
     * @dev Function for depositing USDC tokens into the contract.
     * @param _amount The amount of USDC tokens to deposit.
     */
    function deposit(uint _amount) public {
        require(IERC20(Usdc).balanceOf(msg.sender) >= _amount, "not enough balance");
        require(IERC20(Usdc).transferFrom(msg.sender, address(this), _amount), 'transfer failed');
        availableBalance[msg.sender] += _amount;
        emit Deposit(msg.sender, _amount);
    }

    /**
     * @dev Function for withdrawing USDC tokens from the contract.
     * @param _amount The amount of USDC tokens to withdraw.
     */
    function withdraw(uint _amount) public {
        require(availableBalance[msg.sender] >= _amount, "not enough balance");
        if(msg.sender == theseusDao){
            uint _insuranceMin = TheseusDAO(payable(theseusDao)).insuranceFundMin();
            require(availableBalance[msg.sender] - _amount >= _insuranceMin);
        }
        availableBalance[msg.sender] -= _amount;
        IERC20(Usdc).transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    
 

} 