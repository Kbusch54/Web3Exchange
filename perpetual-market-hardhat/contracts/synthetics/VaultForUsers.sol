// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../tokens/PoolErc20.sol";
import "../tokens/FakeErc20.sol";
import "./USDCController.sol";
import "../Market.sol";
import "hardhat/console.sol";



contract VaultForUsers{
      using SafeMath for uint;
      using SafeMath for int;

        uint constant DECIMAL_PRECISION = 4;

    address public USDC;
    address public Controller;
    address public MarketCont;

    uint public totalUsdc;
    uint public usdcInTreasury;
    uint public usdcInMarket;
    uint public usdcOwnedByUsers;

    uint public MMR;//percentage for minimum margin rate 2 decimals
    uint public MAX_LEV;//whole number 


    event OpenPosition(address indexed trader, bytes32 indexed tradeId);
    event ClosePosition(address indexed trader, bytes32 indexed tradeId, uint closeBlock, uint pnl,bool liquidated);


    mapping(address => uint256)public vaultBalances;
    mapping(address => uint256)public userBalInMarket;
    mapping(bytes32 => uint256)public tradeIdToPosition;
    mapping(address => bytes32[])public traderToIds;
    mapping(bytes32=> uint)public totalLendingFeesPayed;
    

    struct Position {
    uint margin;
    address trader;
    int8 side;
    address currency;
    uint positionSize;//4 decimals
    uint outstandingLoan;
    int liquidationPrice;//6 decmials 
    uint entryPrice;
    uint openValue;
    uint openBlock;
    uint addedLiquidity;
    bool isActive;

}
Position[] public positions;

constructor(uint _newMMR){
    changeMMR(_newMMR);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Controller functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * This function closes position by trade Id.
 *
 * @param _tradeId The first number to add.
 * @return pnl profit loss in usdc
 */
function closePosition(bytes32 _tradeId)public returns(int pnl){
    uint tradingFee;

    uint _index = tradeIdToPosition[_tradeId];
    Position memory pos = positions[_index];
    // require(checkLiquidation(_tradeId)==false,"Liquidate");
    pos.isActive = false;
    Market market = Market(MarketCont);
    (uint _usdcAmt,)= market.closePosition(pos.currency,pos.positionSize); 
    usdcInMarket-=pos.openValue;
    int pnlBeforeFees = int(_usdcAmt) - int(pos.openValue);
    if(pos.outstandingLoan !=0){
        USDCController cont = USDCController(Controller);
       ( uint loanAmount, uint loanFee )= cont.closeDebt(msg.sender,_tradeId);
        _usdcAmt -=loanAmount;
        _usdcAmt -=loanFee;
        usdcInTreasury-= (loanFee + loanAmount);
 
    }
    tradingFee = pnlBeforeFees>0? uint(pnlBeforeFees)/100:0;
    _usdcAmt -= tradingFee;
    usdcInTreasury+=tradingFee;
    usdcInTreasury -= _usdcAmt;
    usdcOwnedByUsers+=_usdcAmt;
    vaultBalances[msg.sender]+=_usdcAmt;
    updateUSDCBalances();
    positions[_index]=pos;
    pnl = pnlBeforeFees-int(tradingFee);
}
/**
 * @dev This function opens position.
 * @param _initialMargin The collateral put down by trader.
 * @param _lev The leverage of the trade.
 * @param _side The side of the trade.
 * @param currency The currency of the trade.
 * @return tradeId
 */
 
function openPositionWithLev(uint256 _initialMargin, uint8 _lev, int8 _side,address  currency)public returns(bytes32 tradeId){
    uint tradingFee;
    require(_lev<=MAX_LEV,'Current leverage is to high for our current allowance');
    if(_initialMargin >200000000){

    tradingFee = _initialMargin/100;
    }else {
        tradingFee = 2000000;}
    require(_initialMargin +tradingFee <=vaultBalances[msg.sender],"Not enough deposited");
    require(_initialMargin >0,"Must have trade minimum");
    // uint256 _initialMargin,uint8 _leverage,bytes32 _tradeId,address _trader
tradeId = keccak256(abi.encodePacked(msg.sender,currency, block.number,_side,_initialMargin));
   (uint loanAmountToVault,uint marginRequirementsForTrader) = USDCController(Controller).borrow(_initialMargin,_lev,tradeId,msg.sender);

      vaultBalances[msg.sender]-=tradingFee + _initialMargin;
      usdcInTreasury+=tradingFee;
    //call market contract

         Market market = Market(MarketCont);
         
         
        (uint openValue, uint positionSize,uint entryPrice) = market.openPosition(currency, _initialMargin + loanAmountToVault);
    //liquidation price
    
        int liquidationPrice = getLiquidationPrice(_initialMargin,positionSize,entryPrice,_side,marginRequirementsForTrader,0);
    //adjust usdc bal
        userBalInMarket[msg.sender]+=_initialMargin;
        usdcOwnedByUsers-=_initialMargin + tradingFee;
        usdcInMarket+=_initialMargin;
    //update struct
      Position memory newPosition;
      newPosition.currency = currency;
      newPosition.margin = _initialMargin;
      newPosition.outstandingLoan = loanAmountToVault;
      newPosition.side = _side;
      newPosition.positionSize = positionSize;//change
      newPosition.liquidationPrice = liquidationPrice; //change
      newPosition.openBlock = block.number; 
      newPosition.openValue = openValue;//change
      newPosition.entryPrice = entryPrice;
      newPosition.isActive=true;
      newPosition.trader = msg.sender;



//update mappings and push positions
    traderToIds[msg.sender].push(tradeId);
    tradeIdToPosition[tradeId]= positions.length;
      positions.push(newPosition);
      totalLendingFeesPayed[tradeId]=marginRequirementsForTrader;
 
}
/**
 * @dev This function gets position by trade Id
 * @param _tradeId The unique key for the position.
 * @return p position
 */
function getPosition(bytes32 _tradeId)public view returns(Position memory p){
            uint _index = tradeIdToPosition[_tradeId];
    Position memory pos = positions[_index];
    p=pos;
}
/**
 * @dev This function gets all positions
 * @return pos all positions
 */
function getAllPositions()public view returns(Position[]memory pos){
    pos =  positions;
}

/**
 * @dev This function gets all positions by trader
 * @param _usdcAmt The amount of usdc the trader would like to add to position.
 * @param _tradeId The unique key for the position.
 * @return true upon completion no reverts
 */
function addLiquidity(uint _usdcAmt, bytes32 _tradeId)public returns(bool){
    //check usdc
    require(_usdcAmt <= vaultBalances[msg.sender],'Not enough USDC Deposited');

    vaultBalances[msg.sender]-=_usdcAmt;
    usdcInMarket +=_usdcAmt;
    usdcOwnedByUsers-=_usdcAmt;
    userBalInMarket[msg.sender]+=_usdcAmt;

    checkUsdcBal();
    
                uint _index = tradeIdToPosition[_tradeId];
    Position storage pos = positions[_index];

    
    uint _al = pos.addedLiquidity +=_usdcAmt;

    pos.liquidationPrice = getLiquidationPrice(pos.margin, pos.positionSize, pos.entryPrice, pos.side,totalLendingFeesPayed[_tradeId],_al);
    return true;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////USDC functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @dev This function allows user to deposit funds (usdc) into vault
 * @param _usdcAmt The amount of usdc the trader would like to deposit.
 */
function deposit(uint _usdcAmt)public{
    transferUsdcFromUser(_usdcAmt,msg.sender);
    usdcOwnedByUsers += _usdcAmt;
    vaultBalances[msg.sender]+= _usdcAmt;
    updateUSDCBalances();
    checkUsdcBal();
}
/**
 *@dev This function allows user to withdraw funds (usdc) from vault
 * @param _usdcAmt The amount of usdc the trader would like to withdraw.
 */
function withdraw(uint _usdcAmt)public{
       IERC20 usdc = IERC20(USDC);
       require(_usdcAmt <= vaultBalances[msg.sender],"Not enough Balance");

    usdcOwnedByUsers -= _usdcAmt;
    usdc.approve(msg.sender,_usdcAmt);
    vaultBalances[msg.sender]-= _usdcAmt;
    usdc.transfer(msg.sender,_usdcAmt);
    updateUSDCBalances();
    checkUsdcBal();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////Utility functions ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *@dev This function allows an account to give funds (usdc) into exchanges treasurey
 * @param _usdcAmt The amount of usdc an account can would like to add.
 */
 function depositUSDCToTreasurey(uint _usdcAmt)public{
        IERC20 usdc = IERC20(USDC);
        require(usdc.allowance(msg.sender,address(this))>= _usdcAmt,'need to increase allowance for vault');

        usdc.transferFrom(msg.sender,address(this),_usdcAmt);
        totalUsdc+=_usdcAmt;
    usdcInTreasury+=_usdcAmt;
    updateUSDCBalances();

    }

/**
 *@dev This function allows contract to transfer usdc from user.
 * @param _usdcAmt The amount of usdc thecontract would like to transfer.
 */
function transferUsdcFromUser(uint _usdcAmt,address sender)internal{
    IERC20 usdc = IERC20(USDC); 
    require(usdc.allowance(sender,address(this)) >= _usdcAmt,"Not enough allowance must approve contract");
    usdc.transferFrom(sender,address(this),_usdcAmt);
}
function updateUSDCBalances()public{
    //     uint totalUSDC;
    // uint UsdcInTreasury;
    // uint UsdcInMarket;
    // uint UsdcOwnedByUsers;
    IERC20 usdc = IERC20(USDC);
    totalUsdc = usdc.balanceOf(address(this));
}
function checkUsdcBal()public{
    uint usdcTotal = usdcInTreasury+ usdcInMarket+ usdcOwnedByUsers;
       IERC20 usdc = IERC20(USDC);
    totalUsdc = usdc.balanceOf(address(this));
    
    require(totalUsdc==usdcTotal,"Balances do not match");
}
function getUsdcBal()public view returns(uint){
    return usdcOwnedByUsers;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////utility functions ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *@dev This function gets all trades by trader.
 * @param _trader The trader address.
 * @return allTrades by trader
 */
    function getAllUserTrades(address _trader)public view returns(bytes32[] memory){
        //check for active trades
        bytes32[] memory amountOfTrades = traderToIds[_trader];
        return amountOfTrades;

    }

    /**
     *@dev This function allows bot to call function to take interest fee.
     * @param _feeAmount The amount of usdc the protocol dictates via fee requirements from loan.
     * @param _tradeId The unique key for the position.
     * @return true upon successful completion no reverts
     */
    function takeInterestFee(uint _feeAmount, bytes32 _tradeId)public returns(bool){
            uint _index = tradeIdToPosition[_tradeId];
    Position memory pos = positions[_index];
    uint totalFee  = totalLendingFeesPayed[_tradeId] +=_feeAmount;
   pos.liquidationPrice= getLiquidationPrice(pos.margin,pos.positionSize,pos.entryPrice,pos.side,totalFee,pos.addedLiquidity);
    

    positions[_index]=pos;
    IERC20 usdc = IERC20(USDC);
    usdcInMarket-=_feeAmount;
    userBalInMarket[pos.trader]-=_feeAmount;
    totalUsdc-=_feeAmount;
    usdc.transfer(Controller,_feeAmount);
    return true;

    }

    /**
     * This function allows to calculate liquidation price
     * @param initialMargin The amount of usdc put down as collateral
     * @param positionSize size of the position 8 decimals
     * @param entryPrice entry price of the position in USDC
     * @param positionSide side of the position 1 for long -1 for short
     * @param fee the total fee amount on a position
     * @param addedLiquidity the amount of liquidity added to a position
     * @return liquidationPrice of asset
     */
    function getLiquidationPrice(uint initialMargin, uint positionSize, uint entryPrice, int8 positionSide,uint fee,uint addedLiquidity)public view returns(int liquidationPrice){
        int side = int(positionSide);
        int marginToBeAdded = intToFixedExact(addedLiquidity,3);
        int adjustFee = intToFixedExact(fee,3);
        int margin = int(uintToFixedExact(initialMargin,3));
        int pSz = int(fixedToUintExact(positionSize,3));
        uint fullMMR = MMR;
        uint sideFull;
        int numerator;
        int divBy ;
        if(side <0){
            
        sideFull = uintToFixedExact(uint(side*-1),4);


            numerator = (margin+(pSz * int(entryPrice))) - marginToBeAdded + adjustFee;
     
            divBy = (int(sideFull + fullMMR))* pSz;
       

        }else{
            
        sideFull = uintToFixedExact(uint(side),4);
       
        numerator = (margin - (pSz *int(entryPrice)))-marginToBeAdded+adjustFee;
     
        if(addedLiquidity>0){

   
        }
        divBy = (int(sideFull - fullMMR))* pSz;
        }
        int newNum = intToFixedExact(uint(numerator<0 ? numerator*-1: numerator),4);
    
       liquidationPrice = newNum/divBy;
       
    }
/////////////////////////////////////////////////////////////////////////DAO FUnctions ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    function updateUSDCAdd(address _usdc)public{
        USDC = _usdc;
    }
       function updateControllerAdd(address _controller)public{
        Controller = _controller;
    }
       function updateMarketAdd(address _market)public{
        MarketCont = _market;
    }

/**
 * @dev This function allows the DAO to change the MMR.
 * and the max leverage. MMR percentage is 4 decimals.
 * Max leverage has restrictions to protect exchange from liquidations
 * @param _newMMR The new MMR.
 */
    function changeMMR(uint _newMMR)public{
        MMR = _newMMR;
        if(_newMMR >=400){

        MAX_LEV = 10000/_newMMR-5;
        }else{
            MAX_LEV = _newMMR<=100?50:_newMMR<=200?30: 25;
        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Decimal Functions //////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  function uintToFixed(uint x) public pure returns (uint ) {
    return  x.mul(10 ** DECIMAL_PRECISION);
}
  function uintToFixedMMR(uint x) public pure returns (uint ) {
    return  x.mul(10 ** 6);
}
function uintToFixedExact(uint x,uint y)public pure returns(uint){
    return x.mul(10**y);
}
  // Declare a function that converts a fixed point number to an integer.
  function fixedToUint(uint y) public pure returns (uint x) {
    return y.div(10 ** DECIMAL_PRECISION);
  }

   function fixedToUintExact(uint y,uint am) public pure returns (uint x) {
    return y.div(10 ** am);
  }

  function intToFixedExact(uint y,uint am )public pure returns(int x){
    return int(y.mul(10 ** am));
  }
      
   




}
