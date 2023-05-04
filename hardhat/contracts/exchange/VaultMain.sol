// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "../loanPools/LoanPool.sol";
import "./Balances.sol";

contract VaultMain is Balances {
//constructor
address public staking;

    constructor(
        address _usdc,
        address _staking
    ) Balances(_usdc) {
        staking = _staking;
    }

 modifier onlyStaking {
        require(msg.sender == staking,'not staking');
        _;
    }
    modifier onlyPool {
        require(msg.sender == loanPool,'not pool');
        _;
    }
    modifier onlyStakingOrPool{
        require(msg.sender == staking || msg.sender == loanPool,'not staking or pool');
        _;
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
    //array of tradIds for each user
    mapping(address => bytes[]) public tradeIds;

    mapping(bytes => Position) public positions;
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
        require(isActive[_tradeId] && msg.sender == _user, "");
        require(payInterestPayments(_tradeId, _amm), "");
        // require(calcFFR(_tradeId,_amm), "ffr payment failed");
        require(_collateral > 0, "");
        require(
            availableBalance[msg.sender] >= _collateral,
            ""
        );
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
    function removeCollateral(
        bytes memory _tradeId,
        uint _collateralToRemove
    ) public returns (bool) {
        (
            address _user,
            address _amm,
            ,
        ) = decodeTradeId(_tradeId);
        require(isActive[_tradeId] && msg.sender == _user, "");
        // uint _liquidationCollateral = liquidateCollateral(_tradeId);
        // require(_liquidationCollateral < tradeCollateral[_tradeId] - _collateralToRemove, "Remove amount to high");
        require(payInterestPayments(_tradeId, _amm), "");
        // require(calcFFR(_tradeId,_amm), "ffr payment failed");
        require(_collateralToRemove > 0, "");
        require(
            tradeCollateral[_tradeId] >= _collateralToRemove,
            ""
        );
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
        uint _interestToBePayed = LoanPool(loanPool).interestOwed(_tradeId, _amm);
        if (tradeCollateral[_tradeId] >= _interestToBePayed) {
            tradeCollateral[_tradeId] -= _interestToBePayed;
            poolAvailableUsdc[_amm] += _interestToBePayed;
            poolTotalUsdcSupply[_amm] += _interestToBePayed;
            positions[_tradeId].collateral - _interestToBePayed;
            require(LoanPool(loanPool).payInterest(_tradeId), "");
        } else {
            liquidate(_tradeId);
        }

        return true;
    }

        function liquidate(bytes memory _tradeId) public {
        2 + 2;
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

      function addPoolTotalUsdcSupply(address _ammPool, uint _amount) external onlyStakingOrPool{
        poolTotalUsdcSupply[_ammPool] += _amount;
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