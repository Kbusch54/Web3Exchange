// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import './Payload.sol';

contract AmmViewer{
    address public theseusDao;
    address public priceFeed;
    bytes public payload;
    mapping(address => bool) public isAmm;

    constructor(address _priceFeed,bytes memory _payload) {
        theseusDao = msg.sender;
        priceFeed = _priceFeed;
        payload = _payload;
    }
    modifier isAmmContract(address ammAddr) {
        require(isAmm[ammAddr], "not amm contract");
        _;
    }
    modifier onlyTheseusDao {
        require(msg.sender == theseusDao, "not theseusDao");
        _;
    }
    modifier onlyAmmContract {
        require(isAmm[msg.sender], "not amm contract");
        _;
    }

        
    event AddAmm(address ammAddr,string name,string symbol, bytes32 payload);
    event RemoveAmm(address ammAddr);
    event AmmOpenPosition(address ammAddr,int amount,uint timestamp);
    event AmmClosePosition(address ammAddr,int amount,uint timestamp);
    event Freeze(address amm);
    event UnFreeze(address amm);
    event PriceChange(address amm, uint currentIndex,uint indexPrice,uint baseAsset,uint quoteAsset,int ffr);
    event NewSnappshot(address amm, uint newIndex);

    function updatePayload(bytes memory _payload) external onlyTheseusDao{
        payload = _payload;
    }
    function addAmm(address ammAddr,string calldata _name,string calldata _symbol, bytes32 _payload) external onlyTheseusDao{
        isAmm[ammAddr] = true;
        emit AddAmm(ammAddr,_name,_symbol,_payload);
    }
    function removeAmm(address ammAddr) external onlyTheseusDao{
        isAmm[ammAddr] = false;
        emit RemoveAmm(ammAddr);
    }
    function updateQuoteAssetStarter(address _amm, uint _quoteAssetStarter) external onlyTheseusDao isAmmContract(_amm){
        bytes memory data = abi.encodeWithSignature("setBaseAssetStarter(uint256)",_quoteAssetStarter);
        (bool success, ) = _amm.call(data);
        require(success, "setBaseAssetStarter failed");
    }
    function updateIndexPricePeriod(address _amm, uint _indexPricePeriod) external onlyTheseusDao isAmmContract(_amm){
        bytes memory data = abi.encodeWithSignature("setIndexPricePeriod(uint256)",_indexPricePeriod);
        (bool success, ) = _amm.call(data);
        require(success, "setIndexPricePeriod failed");
    }
    function emitAmmOpenPosition( int amount) external onlyAmmContract{
        emit AmmOpenPosition(msg.sender,amount,block.timestamp);
    }
    function emitAmmClosePosition( int amount) external onlyAmmContract{
        emit AmmClosePosition(msg.sender,amount,block.timestamp);
    }
    function emitFreeze() external onlyAmmContract{
        emit Freeze(msg.sender);
    }
    function emitUnFreeze() external onlyAmmContract{
        emit UnFreeze(msg.sender);
    }
    function emitPriceChange( uint currentIndex,uint indexPrice,uint baseAsset,uint quoteAsset,int ffr) external onlyAmmContract{
        emit PriceChange(msg.sender,currentIndex,indexPrice,baseAsset,quoteAsset,ffr);
    }
    function emitNewSnappshot( uint newIndex) external onlyAmmContract{
        emit NewSnappshot(msg.sender,newIndex);
    }
     function getPriceValue(bytes calldata _payload,bytes32 _stock) public view returns (uint256) {
        return Payload(priceFeed).getLatestPrice(_payload,_stock);
    }
    function updatePriceFeed(address _priceFeed) external onlyTheseusDao{
        priceFeed = _priceFeed;
    }
    function updateTheseusDao(address _theseusDao) external onlyTheseusDao{
        theseusDao = _theseusDao;
    }
    



}