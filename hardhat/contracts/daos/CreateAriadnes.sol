// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


import "../../node_modules/@openzeppelin/contracts/utils/Create2.sol";

import "./AriadneDAO.sol";

//custom errors
error CALLER_NOT_REGISTERED();

contract CreateAriadnes {
    address public theseusDAO;
    AriadneDAO[] public ariadneDAOs;
    mapping(address => bool) existsAriadne;

    // event Create2Event(
    //     uint256 indexed contractId,
    //     string name,
    //     address indexed contractAddress,
    //     address creator,
    //     address indexed ammAddress
    // );


    // event Owners(
    //     address indexed contractAddress,
    //     address[] owners,
    //     uint256 indexed signaturesRequired
    // );
    // event ExecutedTransaction(
    //     address indexed ariadneDAO,
    //     address indexed executor,
    //     address  to,
    //     uint256 value,
    //     bytes data,
    //     uint256 nonce,
    //     bytes32 hash,
    //     bytes result
    // );
    modifier onlyTheseusDAO() {
        require(msg.sender == theseusDAO, "Only TheseusDAO can call this.");
        _;
    }

    modifier onlyRegistered() {
        if (!existsAriadne[msg.sender]) {
            revert CALLER_NOT_REGISTERED();
        }
        _;
    }
    constructor(address _theseusDAO) {
        theseusDAO = _theseusDAO;
    }

    // function emitOwners(
    //     address _contractAddress,
    //     address _ammAddress,
    //     uint256 _signaturesRequired
    // ) external onlyRegistered {
    //     emit Owners(_contractAddress, _owners, _signaturesRequired);
    // }
    // function emitExectuedTransaction(
    //     address executor,
    //     address to,
    //     uint256 value,
    //     bytes calldata data,
    //     uint256 nonce,
    //     bytes32 hash,
    //     bytes calldata result) external onlyRegistered{
    //         emit ExecutedTransaction(msg.sender,executor, to,value,data,nonce,hash,result);
    //     }

    function numberOfAriadnes() public view returns (uint256) {
        return ariadneDAOs.length;
    }
    // function emitDeposit(address  sender, uint256 amount, uint256 balance)onlyRegistered external{
    //     emit Deposit(msg.sender,sender,amount,balance);
    // }

    function getAriadne(uint256 _index)
        public
        view
        returns (
            address ariadneDaoAddress,
            uint256 votesNeededPercentage
        )
    {
        AriadneDAO ariadneDAO = ariadneDAOs[_index];
        return (
            address(ariadneDAO),
            ariadneDAO.votesNeededPercentage()
        );
    }

    function create2(
        string calldata _name,
        address  _amm,
        uint _votingTime,
        uint _maxVotingPower,
        uint _minVotingPower,
        uint _votesNeededPercentage,
        uint _tokenId,
        address _staking,
        address _pt
    ) public onlyTheseusDAO payable {
        // uint256 id = numberOfAriadnes();

        bytes32 _salt = keccak256(
            abi.encodePacked(abi.encode(_name, address(msg.sender)))
        );

        /**----------------------
         * create2 implementation
         * ---------------------*/
        address ariadne_address = payable(
            Create2.deploy(
                msg.value,
                _salt,
                abi.encodePacked(
                    type(AriadneDAO).creationCode,
                    abi.encode(_name, address(this))
                )
            )
        );

        AriadneDAO ariadneDAO = AriadneDAO(payable(ariadne_address));

        /**----------------------
         * init remaining values
         * ---------------------*/
        ariadneDAO.init(_amm,_votingTime,_maxVotingPower,_minVotingPower,_votesNeededPercentage,_tokenId,_staking,_pt);

        ariadneDAOs.push(ariadneDAO);
        existsAriadne[address(ariadne_address)] = true;

        // emit Create2Event(
        //     id,
        //     _name,
        //     address(ariadneDAO),
        //     msg.sender,
        //     _tokenId,
        //     _signaturesRequired
        // );
        // emit Owners(address(multiSig), _owners, _signaturesRequired);
    }

    /**----------------------
     * get a pre-computed address
     * ---------------------*/
    function computedAddress(string calldata _name)public view returns (address){
        bytes32 bytecodeHash = keccak256(
            abi.encodePacked(
                type(AriadneDAO).creationCode,
                abi.encode(_name, address(this))
            )
        );

        bytes32 _salt = keccak256(
            abi.encodePacked(abi.encode(_name, address(msg.sender)))
        );
        address computed_address = Create2.computeAddress(_salt, bytecodeHash);

        return computed_address;
    }
}