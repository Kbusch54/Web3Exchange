// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "../loanPools/LoanPool.sol";
import "./Balances.sol";
import "../tokens/Staking.sol";
import "../amm/VAmm.sol";
import "./ExchangeViewer.sol";
import "../libraries/ExchangeLibrary.sol";

contract VaultMain is Balances {
    address public staking;
    address public exchangeViewer;
    using ExchangeLibrary for bytes;

    mapping(bytes => bool) public isActive;
       mapping(bytes => Position) public positions;
    //array of tradIds for each user
    mapping(address => bytes[]) public tradeIds;

    bytes[] public tradeIdList;

    constructor(
        address _usdc,
        address _staking,
        address _theseusDao
    ) Balances(_usdc) {
        staking = _staking;
        theseusDao = _theseusDao;
    }
  
  
    modifier onlyStaking {
        _onlyStaking();
        _;
    }
    modifier onlyPool {
        _onlyPool();
        _;
    }
    modifier onlyStakingOrPool{
        _onlyStakingOrPool();
        _;
    }


    event AddCollateral(
        address indexed trader, uint timestamp,
        uint amount
    );

    event RemoveCollateral(
        address indexed trader, uint timestamp,
        uint amount
    );
    event PayInterest(address indexed trader, uint timestamp, uint totalAmount,uint amountToPool);
    event FfrAdjust(address indexed trader, uint timestamp, int amount);

function _onlyStaking() private view {
        require(msg.sender == staking);
    }
    function _onlyPool() private view {
        require(msg.sender == loanPool);
    }
    function _onlyStakingOrPool() private view {
        require(msg.sender == staking || msg.sender == loanPool);
    }
 
     /**
     * @dev Check if the sender is authorized for a specific trade ID.
     * @param _tradeId The trade ID to check authorization for.]
     */
    function _checkAuthorization(
        bytes memory _tradeId
    ) internal view  {
        (address _user, , , ) = decodeTradeId(_tradeId);
        require(isActive[_tradeId]);
        require(msg.sender == _user || msg.sender == theseusDao);
    }

   
  

    /// @dev Position struct to store details about a user's position
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
 

    /** 
* @dev Function to get the tradeIds of a user
    @param _user The address of the user
    @return An array of tradeIds associated with the user
*/
    function getTradeIds(address _user) public view returns (bytes[] memory) {
        return tradeIds[_user];
    }
     function getTradeIdList() public view returns (bytes[] memory) {
        return tradeIdList;
    }

   

        /**
     * @dev Function to add collateral to a position
     * @param _tradeId The tradeId of the position
     * @param _collateral The amount of collateral to add
     * @return A boolean value indicating whether the operation succeeded
     */
    function addCollateral(
        bytes memory _tradeId,
        uint _collateral
    ) public returns (bool) {
        _checkAuthorization(_tradeId);
        (address _user,address _amm,uint _timeStamp, ) = decodeTradeId(_tradeId);
        _payments(_tradeId, _amm);
        require(_collateral > 0);
        require(availableBalance[msg.sender] >= _collateral);
        availableBalance[msg.sender] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        emit AddCollateral(_user,_timeStamp, _collateral);
        return true;
    }

        /**
     * @dev Function to remove collateral from a position
     * @param _tradeId tradeId of the position
     * @param _collateralToRemove the amount of collateral to remove
     * @return A boolean value indicating whether the operation succeeded
     */
    function removeCollateral(bytes memory _tradeId, uint _collateralToRemove) public returns (bool) {
        _checkAuthorization(_tradeId);
        (address _user,address _amm,uint _timeStamp,) = decodeTradeId(_tradeId);
        _payments(_tradeId, _amm);
        require(_collateralToRemove > 0);
        require(tradeCollateral[_tradeId] >= _collateralToRemove);
        tradeCollateral[_tradeId] -= _collateralToRemove;
        availableBalance[msg.sender] += _collateralToRemove;
        emit RemoveCollateral(_user,_timeStamp, _collateralToRemove);
        return true;
    }

    /**
    @dev Function to pay interest payments for a position
    @param _tradeId The tradeId of the position
    @param _amm The address of the AMM contract
    @return A boolean value indicating whether the operation succeeded
     */
    function payInterestPayments(
        bytes memory _tradeId,
        address _amm
    ) public returns (bool) {
        (uint _fullInterest,uint _toPools) = LoanPool(loanPool).interestOwed(_tradeId, _amm);
        tradeCollateral[_tradeId] -= _fullInterest;
        poolAvailableUsdc[_amm] += _toPools;
        poolTotalUsdcSupply[_amm] += _toPools;
                (address _trader,,uint _timeStamp,) = decodeTradeId(_tradeId);
        emit PayInterest(_trader,_timeStamp, _fullInterest,_toPools);
        _toPools == _fullInterest ? () :payDebt(_toPools,_amm);
        LoanPool(loanPool).payInterest(_tradeId);
        return true;
    }
     /**
     *@dev Function to pay the funding rate for a position
     @param _tradeId The tradeId of the position
     @param _amm The address of the AMM contract
     @return A boolean value indicating whether the operation succeeded
     */
    function payFFR(
        bytes memory _tradeId,
        address _amm
    ) internal returns (bool) {
        uint _intialTradeBalance = tradeBalance[_tradeId];
        (int _ffrToBePayed) = ExchangeViewer(exchangeViewer).calcFFRFull(_tradeId, _amm,_intialTradeBalance);
        VAmm vamm = VAmm(_amm);
            uint _lastFFR = vamm.getLastFundingRateIndex();
        if (_ffrToBePayed > 0) {
            uint _ffrCal = uint(_ffrToBePayed);
            tradeCollateral[_tradeId] += _ffrCal;
            poolAvailableUsdc[_amm] -= _ffrCal;
            poolTotalUsdcSupply[_amm] -= _ffrCal;
            // positions[_tradeId].collateral += _ffrCal;
            positions[_tradeId].lastFundingRate = _lastFFR;
        } else {
            uint _ffrCal = uint(_ffrToBePayed * -1);
            tradeCollateral[_tradeId] -= _ffrCal;
            // positions[_tradeId].collateral -= _ffrCal;
            poolAvailableUsdc[_amm] += _ffrCal;
            poolTotalUsdcSupply[_amm] += _ffrCal;
            positions[_tradeId].lastFundingRate = _lastFFR;
        }
                (address _trader,,uint _timeStamp,) = decodeTradeId(_tradeId);
            emit FfrAdjust(_trader,_timeStamp, _ffrToBePayed);
        return true;
    }

       function _payments(bytes memory _tradeId, address _amm)internal{
        require(payInterestPayments(_tradeId, _amm));
        require(payFFR(_tradeId,_amm));
    }
   
    function payDebt(uint _amount,address _amm) internal {
        LoanPool(loanPool).subDebt(_amount,_amm);
        availableBalance[theseusDao] += _amount;
        
    }

    function addAmm(address _amm) public onlyTheseusDao returns(uint){
        require(!isAmm[_amm]);
        isAmm[_amm] = true;
        return Staking(staking).addAmmTokenToPool(_amm);
    }
       function registerLoanPool(address _pool) public onlyTheseusDao {
        require(loanPool == address(0));
        loanPool = _pool;
    }

      function addPoolTotalUsdcSupply(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolTotalUsdcSupply[_ammPool] += _amount;
        if(_ammPool == theseusDao){
            availableBalance[_ammPool] += _amount;
        }
    }
      function setExchangeViewer(address _exchangeViewer)public onlyTheseusDao{
        exchangeViewer = _exchangeViewer;
    }
    function subPoolTotalUsdcSupply(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolTotalUsdcSupply[_ammPool] -= _amount;
        if(_ammPool == theseusDao){
            availableBalance[_ammPool] -= _amount;
        }
    }

    function addPoolAvailableUsdc(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolAvailableUsdc[_ammPool] += _amount;
    }
    function subPoolAvailableUsdc(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolAvailableUsdc[_ammPool] -= _amount;
    }
    
    function addAvailableBalance(address _user, uint _amount) external onlyStakingOrPool{
        availableBalance[_user] += _amount;
    }
    function subAvailableBalance(address _user, uint _amount) external onlyStakingOrPool{
        availableBalance[_user] -= _amount;
    }
    function addPoolOutstandingLoans(address _ammPool, uint _amount) external onlyPool{
        poolOutstandingLoans[_ammPool] += _amount;
    }
    function subPoolOutstandingLoans(address _ammPool, uint _amount) external onlyPool{
        poolOutstandingLoans[_ammPool] -= _amount;
    }

            /**
    *@dev Function to decode a tradeId
    *@param encodedData The encoded data of the tradeId
    *@return A tuple containing the following values:
            - The user address
            - The AMM address
            - The timestamp of the trade
            - The side of the trade (1 for long, -1 for short)
     */
    function decodeTradeId(
        bytes memory encodedData
    ) public pure  returns (address, address, uint, int) {

        return abi.decode(
            encodedData,
            (address, address, uint256, int256)
        );
 
    }

}