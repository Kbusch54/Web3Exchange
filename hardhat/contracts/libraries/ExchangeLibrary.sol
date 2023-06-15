// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Library for common functions
library ExchangeLibrary {


    /**
     * @dev Check if the sender is authorized for a specific trade ID.
     * @param _tradeId The trade ID to check authorization for.]
     * @param _isActive The mapping of trade IDs to their active status.
     */
    function checkAuthorization(
        bytes memory _tradeId,
        address sender,
        mapping(bytes => bool) storage _isActive,
        address theseusDao
    ) public  {
        // Perform the authorization check here
        (address _user, , , ) = decodeTradeId(_tradeId);
        require(_isActive[_tradeId], "Trade ID not active");
        require((sender == _user || sender == theseusDao), "Not authorized");
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
    function decodeTradeId(bytes memory encodedData) public  returns (address, address, uint, int) {

        return abi.decode(
            encodedData,
            (address, address, uint256, int256)
        );
 
    }
            /**
    *@dev Function to decode a tradeId
    *@param encodedData The encoded data of the tradeId
    *@return A tuple containing the following values:
            - The user address
            - The timestamp of the trade
     */
    function decodeTradeIdPartial(bytes memory encodedData) public  returns (address, uint) {

        (address trader, ,uint timestamp,)= abi.decode(
            encodedData,
            (address, address, uint256, int256)
        );
        return (trader,timestamp);
 
    }


function validateOpenPosition(
        int _side,
        uint _collateral,
        uint _leverage,
        address _amm,
        address _sender,
        mapping(address => uint) storage availableBalance,
        mapping(address => bool) storage isAmm
    ) public view {
        require(_side == 1 || _side == -1);
        require(_collateral > 0);
        require(_leverage > 0);
        require(isAmm[_amm]);
        require(availableBalance[_sender] >= _collateral);
    }
}