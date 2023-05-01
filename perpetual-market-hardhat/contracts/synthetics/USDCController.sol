// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../tokens/PoolErc20.sol";
import "./VaultForUsers.sol";
import "../tokens/FakeErc20.sol";
import 'hardhat/console.sol';

contract USDCController is ERC20{
    using SafeMath for uint256;

   /**
    *   @dev Define address of owner
 */ 
    address public owner;

    /**
     *  @dev Define address of vault
     */
    address public vault;

     //Define address of USDC contract
    address public USDC;

    //Define address for DOA
    address public DAO;

    //Define TotalSupply of USDC
    uint public totalUSDCSupply;

//Define intrest period
    uint public interestPeriod = 3582;//avg blocks in 12 hour period

    //Define USDC supply out on loan;
    uint public loanedUSDC;

        //Define USDC supply out on loan;
    uint public availableUSDC;

    //Define max loan %
    uint public maxLoan =70;

    //Define loanFeePercentage for cost to loan USDC
    uint public loanFeePercentage = 100;//1% 2 decimals

    // Define the mapping to store the balance of each user
    mapping(address => uint256) public balances;

    // Define the mapping to store the debt of each user
    mapping(address => uint256) public userDebt;

        // Define the mapping to store the debt of each trade
    mapping(bytes32 => uint256) public tradeDebt;

    mapping(bytes32 => uint256)public tradeMarginRequired;

    mapping(bytes32 => uint256)public nextIntrestBlock;

    mapping(bytes32 => uint256)public totalTradeValueAfterClose;


    // Define the mapping to store the available collateral of each user
    mapping(address => uint256) public availableCollateral;



    // Define the constructor to initialize the owner and the minimum collateralization ratio
    constructor(address _vault,address _usdc) ERC20('USDCPool', "PoTok") {
        owner = msg.sender;
        vault = _vault;
        USDC = _usdc;

    }




    // Define the modifier to allow only the vault contract to call a function
    modifier onlyVault() {
        require(msg.sender == vault, "Only the vault contract can call this function");
        _;
    }
     // Define the modifier to allow only the dao contract to call a function
    modifier onlyDAO() {
        require(msg.sender == DAO, "Only the DAO contract can call this function");
        _;
    }


event Borrowed(bytes32 tradeId, address trader, uint loanAmount, uint intrestPaymentAmount);
//event for repayment of loans eithger on close trade,liquidation, or partial repayment when trader wants to lower lev
event Repayed(bytes32 tradeId, address trader,uint loanAmountRepayed,uint outstandingLoan,uint tradeValueToPool);
event IntrestPayment(bytes32 tradeId, address trader, uint payment);
event Closed(bytes32 tradeId,address trader,uint totalAmountMade);
event Staked(address staker, uint totalUSDCSupply, uint totalPTokSupply, uint newlyMintedPTok,uint addedUSDC);
event Withdraw(address withdrawer, uint totalUSDCSupply, uint totalPtokSupply, uint burnedPTok, uint amountWithdrawn);
event ChangedInterestPeriod(uint oldInterestPeriod,uint newPeriod); 
event ChangedMaxLoanPercentage(uint oldMaxLoanPercentage,uint newMaxLoanPercentage);
event ChangedVault(address oldVault,address newVault);
event ChangedDAO(address oldDAO, address newDAO);


    // Define the function to allow users to borrow the synthetic BTC asset 

    /**
     * @dev Allows users to borrow the USDC pool to use for leveraged trading
     * @param _initialMargin The initial margin the total collateral the trade has put down
     * @param _leverage The leverage the trade is using
     * @param _tradeId The trade id of the trade
     * @param _trader The address of the trader
     * @return loanAmountToVault The amount of USDC the pool sends to vault to be used for trade
     * @return marginRequirementsForTrader The amount of USDC the trader must have in margin to maintain the trade without liquidation
     */
    function borrow(uint256 _initialMargin,uint8 _leverage,bytes32 _tradeId,address _trader)onlyVault external returns(uint loanAmountToVault,uint marginRequirementsForTrader){

        uint _loanAmount = uint256(_leverage) * _initialMargin - _initialMargin;
        // require(_loanAmount <= availableCollateral[_trader], "Insufficient available collateral");
        require(_loanAmount <= availableUSDC, "Insufficient USDC available");
        availableCollateral[_trader] +=_initialMargin;
        userDebt[_trader] += _loanAmount;
        tradeDebt[_tradeId] += _loanAmount;
        loanAmountToVault = _loanAmount;
        loanedUSDC+=_loanAmount;
        updateUSDCSupply();
        //current margin required every 12 hours
        marginRequirementsForTrader = tradeMarginRequired[_tradeId] = _loanAmount /loanFeePercentage;
        nextIntrestBlock[_tradeId]+=block.number+interestPeriod;
        emit Borrowed(_tradeId,_trader,_loanAmount,marginRequirementsForTrader);

    }

/**
 * TODO: fix usdc tracking
 * @dev Allows users to repay the USDC pool for the loan they took out.
 * also used for remove liquidity from pool to lessen trades risk
 * @param _tradeId The trade id of the trade
 * @param _usdcAmt The amount of USDC the trader is paying back to the pool
 * @param _trader The address of the trader
 * @return fee The amount of USDC the trader must pay to the pool for the loan
 */
    function repayLoan(bytes32 _tradeId, uint _usdcAmt,address _trader )public returns(uint fee){
        uint currentLoanAmount = tradeDebt[_tradeId];
        console.log('repay loan');
        console.log("current loan amount",currentLoanAmount);
        console.log("amount to pay back",_usdcAmt);
        require(currentLoanAmount >=_usdcAmt,"You are paying back more than loaned");

        fee = _usdcAmt/loanFeePercentage;
        console.log('fee',fee);
        // require(fee == _payableUsdc,"In order to pay loan must pay interest owed");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////might want function on vault for taking usdc///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        VaultForUsers v = VaultForUsers(vault);
        v.takeInterestFee(fee,_tradeId);
        console.log('fee taken');
        console.log('trade debt updated',tradeDebt[_tradeId]);
       tradeDebt[_tradeId] -=_usdcAmt;
        tradeMarginRequired[_tradeId]-=fee;
        loanedUSDC -= _usdcAmt;
        updateUSDCSupply();
        console.log('repay loan done',_usdcAmt);
      
        console.log('user debt',userDebt[_trader]);
        userDebt[_trader]-=_usdcAmt;
        totalTradeValueAfterClose[_tradeId]+=fee;
        emit Repayed(_tradeId,_trader,_usdcAmt,currentLoanAmount-_usdcAmt,_usdcAmt+fee);   
        console.log('repay loan done done');

    }
    /**
     * TODO: fix usdc tracking
     * @dev Allows users to repay the USDC pool for all the loan they took out.
     * @param _tradeId The trade id of the trade
     * @return usdcAmt The amount of USDC the trade must pay back to the pool
     * @return payableUsdcAmt The amount of USDC the trader must pay to the pool for the loan
     */
    function repayAll(bytes32 _tradeId)public view returns(uint usdcAmt,uint payableUsdcAmt){
        usdcAmt = tradeDebt[_tradeId];
        payableUsdcAmt = findInterestFeeOwed(_tradeId,usdcAmt);

    }
    /**
     * @dev Allows callers to find the amount of USDC the trade must pay to the pool for the loan
     * @param _tradeId The trade id of the trade
     * @param loanRepaymentAmt The amount of USDC the trade is paying back to the pool
     * @return _feeAmt The amount of USDC the fee for loaning from the pool * the amount of interest blocks have past since last repayment (12 hours)
     */
    function findInterestFeeOwed(bytes32 _tradeId,uint loanRepaymentAmt)public view returns(uint _feeAmt){
              uint unadjustedFee = loanRepaymentAmt/loanFeePercentage;
        _feeAmt = unadjustedFee * ((nextIntrestBlock[_tradeId]-block.number)/interestPeriod +1);
    }
 


//on closed or liquidated position

/**
 * TODO: fix usdc tracking
 * @dev allows the vault to close the trade and pay the trader the profit or called upon liquidation
 * @param _trader The address of the trader
 * @param _tradeId The trade id of the trade
 * @return _usdcAmt The amount of USDC the trade must pay back to the pool i.e. the loan amount
 * @return payableUsdc The amount of USDC the trader must pay to the pool for the loan i.e. interest this comes from margin
 */
function closeDebt(address _trader, bytes32 _tradeId)onlyVault external returns(uint _usdcAmt, uint payableUsdc) {
    console.log("closeDebt");
    ( _usdcAmt, payableUsdc) = repayAll(_tradeId);
    console.log('usdcAmt: %s',_usdcAmt);
    console.log('payable',payableUsdc);
    repayLoan( _tradeId,_usdcAmt,_trader);
    console.log('hellop there after repayLoan');
    require(tradeDebt[_tradeId] == 0,"Must be repayed in full");
    require(tradeMarginRequired[_tradeId] ==0,'Trade Margin must be 0');
    uint totalTradePoolProfit =totalTradeValueAfterClose[_tradeId];
    emit Closed(_tradeId,_trader,totalTradePoolProfit);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////PoolERC20 functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @dev Allows users to stake USDC to the pool in exchange for pkTokens
 * @param _amount The amount of USDC the user is staking
 * emit Staked
 */
function stakeUsdc(uint _amount)public {
    IERC20 usdc = IERC20(USDC); 
    uint allowedAmt = usdc.allowance(msg.sender,address(this));
    require(allowedAmt >= _amount, "Must approve contract to stake");
    usdc.transferFrom(msg.sender,address(this),_amount);
    uint ts;
    uint tUsdcS;
    if(totalSupply() == 0){
         ts = 1;    
    }else{
         ts = totalSupply();
    }
    if(totalUSDCSupply == 0){
         tUsdcS =1;
    }else{
         tUsdcS = totalUSDCSupply;
    }
    uint pTokMint = (_amount / tUsdcS)*ts;
    _mint(msg.sender,pTokMint);
    updateUSDCSupply();
    emit Staked(msg.sender,totalUSDCSupply,totalSupply(),pTokMint,_amount);
}

/**
 * @dev Allows users to unstake USDC from the pool in exchange for pkTokens
 * will not allow if current loan amount - withdraw amount is greater than current MAXLoan of total USDC supply
 * thereby taking out more USDC than is available
 * @param _pTokAmt The amount of pkTokens the user is unstaking
 * emit Withdrawn
 */
function withdrawStake(uint _pTokAmt)public {
    IERC20 usdc = IERC20(USDC); 
    require(balanceOf(msg.sender) <= _pTokAmt,"You cannot unstake more tokens than you have");
    uint tokenBal = totalSupply();
    uint usdcAmt = (totalUSDCSupply/tokenBal)*_pTokAmt;
    if(loanedUSDC !=0){

    uint outToLoanPercentage = loanedUSDC/(totalUSDCSupply-usdcAmt)*100;
    require(maxLoan >= outToLoanPercentage,"Must wait for loans to be repayed for withdraw this amount");
    }
    require(usdcAmt <= availableUSDC,'Not enough availbe USDC for withdraw');
    _burn(msg.sender,_pTokAmt);
    usdc.transfer(msg.sender,usdcAmt);
updateUSDCSupply();
    emit Withdraw(msg.sender,totalUSDCSupply,totalSupply(),_pTokAmt,usdcAmt);
    

}
function receiveUSDC(uint _amt)public{
        IERC20 usdc = IERC20(USDC); 
    uint allowedAmt = usdc.allowance(msg.sender,address(this));
    require(allowedAmt >= _amt, "Must approve contract to send usdc");
        usdc.transferFrom(msg.sender,address(this),_amt);
        updateUSDCSupply();
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////DAO functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @dev Allows the DAO to change the max loan percentage
 * the max loan percentage is the percentage of the total USDC supply that can be loaned out
 * @param _newMaxLoan The new max loan percentage
 */
function changeMaxLoan(uint _newMaxLoan)public {
    emit ChangedMaxLoanPercentage(maxLoan,_newMaxLoan);
    maxLoan = _newMaxLoan;
}

/**
 * @dev Allows the DAO to change the interest period
 * the interest period is the number of blocks between interest payments
 * @param _newInterestPeriod The new interest period
 */
function changeInterestPeriod(uint _newInterestPeriod)public{
    emit ChangedInterestPeriod(interestPeriod,_newInterestPeriod);
    interestPeriod = _newInterestPeriod;
}
/**
 * @dev Allows the DAO to change the DAO address
 * @param _newDao The new DAO address
 */
function updateDAOAddress(address _newDao)public{
    emit ChangedDAO(DAO,_newDao);
    DAO = _newDao;
}
/**
 * @dev Allows the DAO to change the loan fee percentage
 * @param _newLoanFeePercentage The new loan fee percentage
 */
function changeLoanFeePercentage(uint _newLoanFeePercentage)public{
    emit ChangedMaxLoanPercentage(loanFeePercentage,_newLoanFeePercentage);
    loanFeePercentage = _newLoanFeePercentage;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Utility functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateUSDCSupply()public{
    IERC20 usdc = IERC20(USDC);
    totalUSDCSupply = usdc.balanceOf(address(this));
    availableUSDC = totalUSDCSupply - loanedUSDC;
}
function transferUsdcFromVault(uint _usdcAmt)public{
    FakeErc20 usdc = FakeErc20(USDC); 
    require(usdc.allowance(vault,address(this)) >= _usdcAmt,"Not enough allowance from vault");
    usdc.transferFrom(vault,address(this),_usdcAmt);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Bot Functions//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 // pay interest on loan 
 //for bot
 //add modifyer only bot

 /**
  * @dev Allows the bot to pay interest on a loan
  * @param _tradeId The trade id of the loan
  * @param _trader The trader who the loan is for
  * @return newIntrestPaymentBlock The new block number that the next interest is due
  * i.e. the current block number + the interest period
  */
    function payOwedIntrest(bytes32 _tradeId,address _trader)public returns(uint newIntrestPaymentBlock){
        uint amountOwed = tradeMarginRequired[_tradeId];
        require(nextIntrestBlock[_tradeId ]>=block.number,'Intrest not due');
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //maybe have a method from vault for this transaction of usdc
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    transferUsdcFromVault(amountOwed);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       totalTradeValueAfterClose[_tradeId] +=amountOwed;
       newIntrestPaymentBlock = nextIntrestBlock[_tradeId]+=block.number+interestPeriod;
       updateUSDCSupply();

       emit IntrestPayment(_tradeId,_trader,amountOwed);

    }
    /**
     * @dev Allows the bot to check if a loan needs to pay interest 
     * or for user to check if they need to pay interest
     * @param _tradeId The trade id of the loan
     * @return needsToPayInterest True if the loan needs to pay interest
     * @return interestOwed The amount of interest owed
     */
    function findOwedInterest(bytes32 _tradeId)public view returns(bool needsToPayInterest, uint interestOwed){
        needsToPayInterest = nextIntrestBlock[_tradeId ]>=block.number;
           interestOwed = tradeMarginRequired[_tradeId];
    }
}
