// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Market{
          using SafeMath for uint;

        uint constant DECIMAL_PRECISION = 6;
            // (uint openValue, uint positionSize)   =market.openPosition(currency, _initalMaargin + outstandingLoan, _tradeId)

uint public btcPrice = 2000000;
uint public ethPrice = 5000000;
// address public BTC = 0x0facf6788EBAa4E7481BCcaFB469CD0DdA089ab3";
// address public ETH = "";

            function getPrice(address currency)public view returns(uint priceInUSDC){
                if(currency == 0x0facf6788EBAa4E7481BCcaFB469CD0DdA089ab3){
                priceInUSDC = btcPrice;
                }else{
                priceInUSDC = ethPrice;
                }
            }

            function openPosition(address currency,uint _collateral)public view returns(uint openValue, uint positionSize,uint entryPrice){
                if(currency == 0x0facf6788EBAa4E7481BCcaFB469CD0DdA089ab3){
                    positionSize = uintToFixed(_collateral)/btcPrice;
                    openValue = _collateral;
                    entryPrice = btcPrice;
                }else{
                    positionSize =uintToFixed(_collateral)/ethPrice;
                    openValue= _collateral;
                    entryPrice = ethPrice;
                } 
            }
            function closePosition(address currency, uint positonSize)public view returns(uint _usdcAmt,uint exitPrice){
                console.log('market position size',positonSize);
                console.log('btc price',btcPrice);
                console.log('market position size/price',positonSize*btcPrice/1000000);

                 if(currency == 0x0facf6788EBAa4E7481BCcaFB469CD0DdA089ab3){
                    _usdcAmt = fixedToUint(positonSize*btcPrice);
                    exitPrice = btcPrice;
                }else{
                    _usdcAmt = fixedToUint(positonSize*ethPrice);
                    exitPrice = ethPrice;
                } 
            }

            function changeBtcPrice(uint _newPrice)public{
                btcPrice = _newPrice;
            }
            function changeEthPrice(uint _newPrice)public{
                ethPrice = _newPrice;
            }




              function uintToFixed(uint x) public pure returns (uint ) {
    return  x.mul(10 ** DECIMAL_PRECISION);
}

  // Declare a function that converts a fixed point number to an integer.
  function fixedToUint(uint y) public pure returns (uint x) {
    return y.div(10 ** DECIMAL_PRECISION);
  }
}