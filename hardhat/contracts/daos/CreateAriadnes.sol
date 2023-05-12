// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;


import "@openzeppelin/contracts/utils/Create2.sol";

import "./AriadneDAO.sol";

//custom errors
error CALLER_NOT_REGISTERED();

contract CreateAriadnes {
    address public theseusDAO;
    AriadneDAO[] public ariadneDAOs;
    mapping(address => bool) existsAriadne;

      uint public votingTime;
        uint public maxVotingPower;
        uint public minVotingPower;
        uint public votesNeededPercentage;
        address public staking;
        address public pt;

    event AriadneCreated(
         uint256 indexed contractId,
        string name,
        address indexed contractAddress,
        address indexed ammAddress
    );
  event AriadneVotingTimeChanged(
        address indexed ariadneDAO,
        uint256 indexed votingTime
    );
    event AriadneMaxVotingPowerChanged(
        address indexed ariadneDAO,
        uint256 indexed maxVotingPower
    );
    event AriadneMinVotingPowerChanged(
        address indexed ariadneDAO,
        uint256 indexed minVotingPower
    );
    event AriadneVotesNeededPercentageChanged(
        address indexed ariadneDAO,
        uint256 indexed votesNeededPercentage
    );


    event ProposalMade(
        address indexed ariadneDAO,
        address indexed proposer,
        address indexed to,
        bytes data,
        uint256 nonce,
        bytes32 transactionHash,
        uint256 timeStamp
    );
    event ExecutedTransaction(
        address indexed ariadneDAO,
        address indexed executor,
        uint256 nonce,
        bytes result
    );
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
    constructor(address _theseusDAO,uint _votingTime,uint _maxVotingPower,uint _minVotingPower,uint _votesNeededPercentage,address _staking,address _pt) {
        theseusDAO = _theseusDAO;
        votingTime = _votingTime;
        maxVotingPower = _maxVotingPower;
        minVotingPower = _minVotingPower;
        votesNeededPercentage = _votesNeededPercentage;
        staking =_staking;
        pt =_pt;
    }
    function emitProposalMade(
        address proposer,
        address to,
        bytes calldata data,
        uint256 nonce,bytes32 transactionHash,uint _timeStamp) external onlyRegistered{
            emit ProposalMade(msg.sender,proposer, to,data,nonce,transactionHash,_timeStamp);
        }

    function emitExectuedTransaction(
        address executor,
        uint256 nonce,
        bytes calldata result) external onlyRegistered{
            emit ExecutedTransaction(msg.sender,executor,nonce,result);
        }

    function emitAriadneVotingTimeChanged(uint256 _votingTime) external onlyRegistered{
        emit AriadneVotingTimeChanged(msg.sender,_votingTime);
    }

    function emitAriadneMaxVotingPowerChanged(uint256 _maxVotingPower) external onlyRegistered{
        emit AriadneMaxVotingPowerChanged(msg.sender,_maxVotingPower);
    }

    function emitAriadneMinVotingPowerChanged(uint256 _minVotingPower) external onlyRegistered{
        emit AriadneMinVotingPowerChanged(msg.sender,_minVotingPower);
    }

    function emitAriadneVotesNeededPercentageChanged(uint256 _votesNeededPercentage) external onlyRegistered{
        emit AriadneVotesNeededPercentageChanged(msg.sender,_votesNeededPercentage);
    }

    function numberOfAriadnes() public view returns (uint256) {
        return ariadneDAOs.length;
    }

    function getAriadne(uint256 _index)
        public
        view
        returns (
            address ariadneDaoAddress,
            uint256 _votesNeededPercentage
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
        uint _tokenId
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
        ariadneDAO.init(_amm,votingTime,maxVotingPower,minVotingPower,votesNeededPercentage,_tokenId,staking,pt);

        ariadneDAOs.push(ariadneDAO);
        existsAriadne[address(ariadne_address)] = true;

        emit AriadneCreated(
            ariadneDAOs.length-1,
            _name,
            address(ariadneDAO),
            _amm
        );
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


      function setVotingTime(uint _votingTime) external onlyTheseusDAO{
        votingTime = _votingTime;
    }
    function setMaxVotingPower(uint _maxVotingPower) external onlyTheseusDAO{
        maxVotingPower = _maxVotingPower;
    }
    function setMinVotingPower(uint _minVotingPower) external onlyTheseusDAO{
        minVotingPower = _minVotingPower;
    }
    function setVotesNeededPercentage(uint _votesNeededPercentage) external onlyTheseusDAO{
        votesNeededPercentage = _votesNeededPercentage;
    }
    function setStaking(address _staking) external onlyTheseusDAO{
        staking = _staking;
    }
    function setPT(address _pt) external onlyTheseusDAO{
        pt = _pt;
    }
}