// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


import "../exchange/Exchange.sol";
import "../tokens/PoolTokens.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Staking
 * @dev A contract for staking and unstaking tokens in a loan pool.
 */
contract Staking {
    address public poolToken;
    address public exchange;
    mapping(address => uint) public ammPoolToTokenId;
    mapping(address => bool) public isFrozen;
    mapping(address=>bool) public hasRegistered;
    uint8 internal poolCount;

    constructor(address _theseusDao) {
        ammPoolToTokenId[_theseusDao] = 0;
    }

    modifier IfIsFrozen(address _ammPool) {
        require(!isFrozen[_ammPool], "Staking: Pool is frozen");
        _;
    }
    modifier OnlyExchange(){
        require(msg.sender==exchange,"Not a loan pool");
        _;
    }
   
 /**
     * @dev Function for staking usdc in the loan pool.
     * @param _amount The amount of usdc to stake.
     * @param _ammPool The address of the AMM pool.
     */
    function stake(uint _amount, address _ammPool) public {
        Exchange ex = Exchange(exchange);
        uint _userBal = ex.availableBalance(msg.sender);
        uint _poolTotalUsdcSupply = ex.poolTotalUsdcSupply(_ammPool);
        require(_userBal >= _amount,'Not enough balance');
        ex.subAvailableBalance(msg.sender, _amount);
        uint _denominator = _poolTotalUsdcSupply>0?_poolTotalUsdcSupply:1;
        uint _porportion = (_amount * 1e18) / _denominator;
        require(
            PoolTokens(poolToken).stakeMint(
                msg.sender,
                ammPoolToTokenId[_ammPool],
                _porportion
            ),
            "Failed to mint tokens "
        );
        //check if dao 
        //if dao add avaible balance to dao check if DAO
        //else add to pool
     
        ex.addPoolTotalUsdcSupply(_ammPool, _amount);
        ex.addPoolAvailableUsdc(_ammPool, _amount);
        //event stake(address _user,uint _amount,uint _porportion);
    }

 /**
     * @dev Function for unstaking tokens from the loan pool.
     * @param _amountToBurn The amount of tokens to unstake (burn).
     * @param _ammPool The address of the AMM pool.
     */
    function unStake(uint _amountToBurn, address _ammPool) public IfIsFrozen(_ammPool) {
        Exchange ex = Exchange(exchange);
        uint _poolTotalUsdcSupply = ex.poolTotalUsdcSupply(_ammPool);
        uint _poolAvailableUsdc = ex.poolAvailableUsdc(_ammPool);
        PoolTokens poolTokCon = PoolTokens(poolToken);
        require(
            _amountToBurn <=
                poolTokCon.balanceOf(msg.sender, ammPoolToTokenId[_ammPool]),
            "Not enough tokens"
        );
        uint _tokenSupply = poolTokCon.totalSupplyTok(
            ammPoolToTokenId[_ammPool]
        );
        uint _porportion = (_amountToBurn * 1e18) / _tokenSupply;
        uint _amount = (_poolTotalUsdcSupply * _porportion) / 1e18;
        require(
            _amount <= _poolAvailableUsdc,
            "Not enough usdc in pool "
        );
        require(
            poolTokCon.burn(msg.sender, ammPoolToTokenId[_ammPool], _amount),
            "Failed to burn tokens"
        );
        ex.subPoolAvailableUsdc(_ammPool, _amount);
        ex.subPoolTotalUsdcSupply(_ammPool, _amount);
        ex.addAvailableBalance(msg.sender, _amount);
        //event unstake(address _user,uint _amount,uint _porportion);
    }


   /**
     * @dev Function for adding an AMM token to the poolTokens contract .
     * @param _ammPool The address of the AMM pool.
     */
    function addAmmTokenToPool(address _ammPool) public {
        require(hasRegistered[_ammPool] == false,"Already added to poolTokens contract"
        );
        poolCount++;
        ammPoolToTokenId[_ammPool] = poolCount;
    }



    function freeze(address _ammPool) public OnlyExchange {
        isFrozen[_ammPool] = true;
    }
    function unFreeze(address _ammPool) public OnlyExchange {
        isFrozen[_ammPool] = false;
    }
    function setExchange(address _exchange) public {
        require(exchange == address(0), "Already set");
        exchange = _exchange;
        
    }
    function setPoolToken(address _poolToken) public {
        require(poolToken == address(0), "Already set");
        poolToken = _poolToken;
    }
}
