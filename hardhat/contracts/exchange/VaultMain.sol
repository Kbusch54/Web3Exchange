// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "../loanPools/LoanPool.sol";
import "./Balances.sol";
import "../tokens/Staking.sol";
import "../amm/VAmm.sol";
import "./ExchangeViewer.sol";

contract VaultMain is Balances {
    address public staking;
    address public exchangeViewer;
    address public theseusDao;

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

function _onlyStaking() private view {
        require(msg.sender == staking,'not staking');
    }
    function _onlyPool() private view {
        require(msg.sender == loanPool,'not pool');
    }
    function _onlyStakingOrPool() private view {
        require(msg.sender == staking || msg.sender == loanPool,'not staking or pool');
    }
  
    //mapping of tradeId to collateral
    mapping(bytes => bool) public isActive;
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
    mapping(bytes => Position) public positions;
    //array of tradIds for each user
    mapping(address => bytes[]) public tradeIds;

    bytes[] public tradeIdList;

    /** 
* @dev Function to get the tradeIds of a user
    @param _user The address of the user
    @return An array of tradeIds associated with the user
*/
    function getTradeIds(address _user) public view returns (bytes[] memory) {
        return tradeIds[_user];
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
        (
            address _user,
            address _amm,,
        ) = decodeTradeId(_tradeId);
        require(payInterestPayments(_tradeId, _amm));
        require(payFFR(_tradeId,_amm));
        require(isActive[_tradeId] && msg.sender == _user);
        require(_collateral > 0);
        require(availableBalance[msg.sender] >= _collateral);
        availableBalance[msg.sender] -= _collateral;
        tradeCollateral[_tradeId] += _collateral;
        return true;
    }


        /**
     * @dev Function to remove collateral from a position
     * @param _tradeId tradeId of the position
     * @param _collateralToRemove the amount of collateral to remove
     * @return A boolean value indicating whether the operation succeeded
     */
    function removeCollateral(bytes memory _tradeId, uint _collateralToRemove) public returns (bool) {
        (address _user,address _amm,,) = decodeTradeId(_tradeId);
        require(isActive[_tradeId] && msg.sender == _user);
        require(payInterestPayments(_tradeId, _amm));
        require(payFFR(_tradeId,_amm));
        require(_collateralToRemove > 0);
        require(tradeCollateral[_tradeId] >= _collateralToRemove);
        tradeCollateral[_tradeId] -= _collateralToRemove;
        availableBalance[msg.sender] += _collateralToRemove;

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
        positions[_tradeId].collateral -= _fullInterest;
        poolAvailableUsdc[_amm] += _toPools;
        poolTotalUsdcSupply[_amm] += _toPools;
        _toPools == _fullInterest ? () :payDebt(_toPools,_amm);
        require(LoanPool(loanPool).payInterest(_tradeId));
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
            positions[_tradeId].collateral + _ffrCal;
            positions[_tradeId].lastFundingRate = _lastFFR;
        } else {
            uint _ffrCal = uint(_ffrToBePayed * -1);
            tradeCollateral[_tradeId] -= _ffrCal;
            positions[_tradeId].collateral - _ffrCal;
            poolAvailableUsdc[_amm] += _ffrCal;
            poolTotalUsdcSupply[_amm] += _ffrCal;
            positions[_tradeId].lastFundingRate = _lastFFR;
        }
        return true;
    }
    function getTradeIdList() public view returns (bytes[] memory) {
        return tradeIdList;
    }
    function payDebt(uint _amount,address _amm) internal {
        LoanPool(loanPool).subDebt(_amount,_amm);
        availableBalance[theseusDao] += _amount;
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
    ) public pure returns (address, address, uint, int) {
        (address _user, address _amm, uint _timeStamp, int _side) = abi.decode(
            encodedData,
            (address, address, uint, int)
        );
        return (_user, _amm, _timeStamp, _side);
    }
    function addAmm(address _amm) public {
        require(!isAmm[_amm]);
        isAmm[_amm] = true;
        Staking(staking).addAmmTokenToPool(_amm);
    }
       function registerLoanPool(address _pool) public {
        require(loanPool == address(0));
        require(msg.sender == theseusDao);
        loanPool = _pool;
    }

      function addPoolTotalUsdcSupply(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolTotalUsdcSupply[_ammPool] += _amount;
    }
      function setExchangeViewer(address _exchangeViewer)public {
        exchangeViewer = _exchangeViewer;
    }
    function subPoolTotalUsdcSupply(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolTotalUsdcSupply[_ammPool] -= _amount;
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

}