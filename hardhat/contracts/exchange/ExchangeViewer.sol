// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./VaultMain.sol";
import "../amm/VAmm.sol";
import "./Exchange.sol";

import "../loanPools/LoanPool.sol";

// import "hardhat/console.sol";
contract ExchangeViewer{


    struct Position {
        uint collateral;
        uint loanedAmount;
        int side;
        int positionSize;
        uint entryPrice;
        uint timeStamp;
        uint lastFundingRate;
        address amm;
        address trader;
    }


    address public loanPool;
    address public usdc;
    address public staking;
    address public theseusDao;
    Exchange public exchange;
    VAmm public vamm;
    
    constructor(
        address _loanPool,
        address _usdc,
        address _staking,
        address _theseusDao,
        address _exchange,
        address _vamm
    ) {
        loanPool = _loanPool;
        usdc = _usdc;
        staking = _staking;
        theseusDao = _theseusDao;
        exchange = Exchange(_exchange);
        vamm = VAmm(_vamm);
    }

         function getPosition(bytes memory _tradeId) public view returns (Position memory) {
        (uint256 a,uint256 b,int256 c ,int256 d ,uint256 e ,uint256 f ,uint256 g,address h ,address i) = exchange.positions(_tradeId);
        Position memory pos = Position(a,b,c,d,e,f,g,h,i);
        return pos;
    }
   
        function calcFFR(
        bytes memory _tradeId,
        address _amm
    ) public view returns (int cumulativeFFR,int side) {
        Position memory _position = getPosition(_tradeId);
        uint lastFFr = vamm.getLastFundingRateIndex();
        int _cumulativeFFR;
        for(uint i = _position.lastFundingRate; i <= lastFFr; i++){
            _cumulativeFFR += vamm.getSnapshotByIndex(i).fundingRate;
        }
      cumulativeFFR = _cumulativeFFR;
        side = _position.side;
    }
       function calcFFRFull(bytes memory _tradeId, address _amm, uint _intialTradeBalance) public view returns (int ffrOwed) {
        (int _cumulativeFFR,int side) = calcFFR(_tradeId, _amm);
        return (_cumulativeFFR*int(_intialTradeBalance)/100000000*side);
    }

    function getValues(
        bytes memory _tradeId
    ) public view returns (uint _collateralAfter, int _usdcAmt) {
        require(exchange.isActive(_tradeId), "");
        LoanPool _pool = LoanPool(loanPool);
        Position memory _position = getPosition(_tradeId);
        address _ammPool = _position.amm;
        (uint _interestOwed,) = _pool.interestOwed(_tradeId, _ammPool);
        int _ffrOwed = calcFFRFull(_tradeId, _ammPool, _position.loanedAmount);
        uint _collateral = _position.collateral;
         _collateralAfter = _ffrOwed > 0
            ? _collateral + uint(_ffrOwed) - _interestOwed
            : _collateral - uint(_ffrOwed * -1) - _interestOwed;
        VAmm _amm = VAmm(_ammPool);
        _usdcAmt = _amm.getClosePosition(_position.positionSize);
    }

    function getAllValues(bytes memory _tradeId)public view returns(uint collateral, uint interest, int ffr, int usdcAmt,uint loanAmount){
        Position memory _position = getPosition(_tradeId);
        address _ammPool = _position.amm;
        (uint _interestOwed,) = LoanPool(loanPool).interestOwed(_tradeId, _ammPool);
        int _ffrOwed = calcFFRFull(_tradeId, _ammPool, _position.loanedAmount);
        uint _collateral = _position.collateral;
        VAmm _amm = VAmm(_ammPool);
        (int _usdcAmt) = _amm.getClosePosition(_position.positionSize);
        return (_collateral, _interestOwed, _ffrOwed, _usdcAmt, _position.loanedAmount);
    }
    

    /**
     *@dev Function to check if position can be liquidated
     @param _tradeId The tradeId of the position
     @return A boolean value indicating whether position can be liquidated
     */
    function checkLiquidiation(
        bytes memory _tradeId
    ) public view returns (bool) {
        (uint _collateralAfter, int _usdcAmt) = getValues(_tradeId);
        Position memory _position = getPosition(_tradeId);
        uint _mmr = LoanPool(loanPool).mmr(_position.amm);
        if (
            ((_collateralAfter - uint(_usdcAmt)) * 10 ** 8) /
                _position.loanedAmount >=
            _mmr
        ) {
            return false;
        } else {
            return true;
        }
    }
     /**
     *@dev Function to get pnl of a position
     @param _tradeId The tradeId of the position
     @return int The pnl of the position
    //  */
    function getPnl(bytes memory _tradeId) public view returns (int) {
        Position memory _pos = getPosition(_tradeId);
        (uint _collateralAfter, int _usdcAmt) = getValues(_tradeId);
        uint _loanedAmt = _pos.loanedAmount;
        return _usdcAmt + int(_collateralAfter) - int(_loanedAmt);
    }

    function checkLiquidiationList() public view returns (bytes[] memory) {
        bytes[] memory _liquidateList;
        uint _count = 0;
        bytes[] memory _tradeIdList = exchange.getTradeIdList();
        for (uint i = 0; i < _tradeIdList.length; i++) {
            if (checkLiquidiation(_tradeIdList[i])) {
                _liquidateList[_count] = (_tradeIdList[i]);
                _count++;
            }
        }
        return _liquidateList;
    }


  
}