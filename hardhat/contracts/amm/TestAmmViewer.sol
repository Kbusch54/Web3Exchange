// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract TestAmmViewer{
    address public theseusDao;
    address public priceFeed;
    bytes public payload;
    mapping(address => bool) public isAmm;

mapping(bytes32=>uint) public priceMap;
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
    event AmmOpenPosition(address ammAddr,  int amount);
    event AmmClosePosition(address ammAddr,  int amount);
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
    function emitAmmOpenPosition( int amount) external onlyAmmContract{
        emit AmmOpenPosition(msg.sender,amount);
    }
    function emitAmmClosePosition( int amount) external onlyAmmContract{
        emit AmmClosePosition(msg.sender,amount);
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
     function getPriceValue(bytes32 _stock) public view returns (uint256) {
        return priceMap[_stock];
    }
    function updatePriceFeed(address _priceFeed) external onlyTheseusDao{
        priceFeed = _priceFeed;
    }
    function updateTheseusDao(address _theseusDao) external onlyTheseusDao{
        theseusDao = _theseusDao;
    }
    function setPriceMap(bytes32 _stock,uint _price)public{
        priceMap[_stock] = _price;
    }
    



}