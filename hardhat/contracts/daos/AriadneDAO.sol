// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
pragma experimental ABIEncoderV2;
import "../../node_modules/@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../tokens/PoolTokens.sol";
import "./CreateAriadnes.sol";

    error NOT_OWNER();
    error NOT_SELF();
    error NOT_STAKING();
    error TX_FAILED();
    error DUPLICATE_OR_UNORDERED_SIGNATURES();
    error TIME_EXPIRED();
error INVALID_OWNER();
error INVALID_SIGNER();
error INVALID_SIGNATURES_REQUIRED();
error INSUFFICIENT_VALID_SIGNATURES();
error NOT_ENOUGH_SIGNERS();
error NOT_FACTORY();
contract AriadneDAO {
    using ECDSA for bytes32;
       CreateAriadnes private immutable createAriandne;
       
    string public name;
    uint256 public constant factoryVersion = 1;
    address public pt;
    address public staking;
    address public amm;
    uint public tokenId;//erc1155 token ID
    uint public currentId;//acting as nonce for proposals
    uint public votingTime;
    uint maxVotingPower; // max quantity of votes allowed per user regardless of tokens held
    uint minVotingPower; //min token req to vote
    uint public votesNeededPercentage; //votes needed to pass a proposal
    mapping(uint => bool) public isProposalPassed;
    mapping(uint => uint) public votesFor;
    mapping(uint => uint) public totalVotes;
    mapping(uint => uint) public proposalTime;
    mapping(uint => bool) public nonceUsed;
    address[] public tokenHolders;

    struct Proposal {
        uint id;
        address proposer;
        address payable to;
        bytes data;
        bytes result;
        uint votesFor;
        uint proposalTime;
        bool isProposalPassed;
    }
    mapping(uint => Proposal) public proposals;//id to proposal
    event ExecuteTransaction(
        address indexed executor,
        address payable to,
        uint256 value,
        bytes data,
        uint256 nonce,
        bytes32 hash,
        bytes result
    );
    modifier onlyOwner() {
        if (PoolTokens(pt).balanceOf(msg.sender,tokenId)<=0 ) {
            revert NOT_OWNER();
        }
        _;
    }

    modifier onlySelf() {
        if (msg.sender != address(this)) {
            revert NOT_SELF();
        }
        _;
    }

    modifier onlyStaking() {
        if(msg.sender != staking) {
            revert NOT_STAKING();
        }
        _;
    }
    modifier checkTime(uint _id) {
        if( proposals[_id].proposalTime + votingTime>block.timestamp) {
            revert TIME_EXPIRED();
        }
        _;
    }

modifier onlyFactory() {
        if (msg.sender != address(createAriandne)) {
            revert NOT_FACTORY();
        }
        _;
    }
    function init(
        address  _amm,
        uint _votingTime,
        uint _maxVotingPower,
        uint _minVotingPower,
        uint _votesNeededPercentage,
        uint _tokenId,
        address _staking,
        address _pt
    ) public payable onlyFactory  {
        votingTime = _votingTime;
        maxVotingPower = _maxVotingPower;
        minVotingPower = _minVotingPower;
        votesNeededPercentage = _votesNeededPercentage;
        tokenId = _tokenId;
        amm = _amm;
        staking = _staking;
        pt = _pt;
    }
     constructor(string memory _name, address _createAriadne) payable {
        name = _name;
        createAriandne = CreateAriadnes(_createAriadne);
    }
   
    function newProposal(address payable to,bytes memory data)public onlyOwner(){
        //emit event
        if(nonceUsed[currentId]) {
            currentId++;
        }
        uint _id = currentId;
        currentId++;
        proposals[_id] = Proposal({
            id:_id,
            proposer:msg.sender,
            to:to,
            data:data,
            result:bytes(""),
            votesFor:0,
            proposalTime:block.timestamp,
            isProposalPassed:false
        });
    }

    function isTokenHolder(address _signer) public view returns(bool) { 
        return PoolTokens(pt).balanceOf(_signer,tokenId)>0;
    }
    function getProportionOfVotes(address _signer) public view returns(uint) {
        uint256 _totalVotes = PoolTokens(pt).balanceOf(_signer,tokenId);
        uint _totalSupply = getTotalSupply();
        if (_totalVotes > maxVotingPower) {
            _totalVotes = maxVotingPower;
        }else if(_totalVotes < minVotingPower) {
            _totalVotes = 0;
        }
        return (_totalVotes*10**6)/_totalSupply;
    }
    function addTokenHolder(address _tokenHolder) public onlyStaking {
        tokenHolders.push(_tokenHolder);
    }
    function getCurrentTokenHolders() public view returns(address[] memory,uint[] memory) {
        uint[] memory balances = new uint[](tokenHolders.length);
        for(uint i=0;i<tokenHolders.length;i++) {
            balances[i] = PoolTokens(pt).balanceOf(tokenHolders[i],tokenId);
        }
        return (tokenHolders,balances);
    }
    function getTotalSupply() public view returns(uint) {
        return PoolTokens(pt).totalSupplyTok(tokenId);
    }
     function updateSignaturesRequired(uint256 newVotesNeededPercentage)public onlySelf{
        votesNeededPercentage = newVotesNeededPercentage;
        //emit event
    }

    function executeTransaction(uint _id,address payable to,uint256 value,bytes calldata data,bytes[] calldata signatures) public onlyOwner checkTime(_id) returns (bytes memory) {
        bytes32 _hash = getTransactionHash(_id, to, value, data);
        nonceUsed[_id] = true;
        uint256 _votes;
        address duplicateGuard;
        for (uint256 i = 0; i < signatures.length; ) {
            address recovered = recover(_hash, signatures[i]);
            if (recovered <= duplicateGuard) {
                revert DUPLICATE_OR_UNORDERED_SIGNATURES();
            }
            duplicateGuard = recovered;

            if (isTokenHolder(recovered)) {
                //get voting power per signer
                uint _votingPower = getProportionOfVotes(recovered);
                _votes += _votingPower;
            }
            unchecked {
                ++i;
            }
        }

        if (_votes < votesNeededPercentage) {
            revert INSUFFICIENT_VALID_SIGNATURES();
        }

        (bool success, bytes memory result) = to.call{value: value}(data);
        if (!success) {
            revert TX_FAILED();
        }

        // emit ExecuteTransaction(
        //     msg.sender,
        //     to,
        //     value,
        //     data,
        //     _id,
        //     _hash,
        //     result
        // );
        return result;
    }

function getTransactionHash(uint256 _nonce,address to, uint256 value,bytes calldata data) public view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    address(this),
                    _nonce,
                    to,
                    value,
                    data
                )
            );
    }
       function recover(bytes32 _hash, bytes calldata _signature)
        public
        pure
        returns (address)
    {
        return _hash.toEthSignedMessageHash().recover(_signature);
    }

    receive() external payable {
        // emit Deposit(msg.sender, msg.value, address(this).balance);
    }


}
