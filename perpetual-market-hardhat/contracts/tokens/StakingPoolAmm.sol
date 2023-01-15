// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PoolErc20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingPoolAmm is PoolERC20 {


        uint public totalUsdcSupply;
    uint public loanedUsdc;
    uint public availableUsdc;
    uint public maxLoan =70;//70% of total usdc
    uint public loanInterestRate =100;//1% interest rate
    uint currentIndexForNewSnapshots=0;
    uint public rewardsIndex=0;
    uint public rewardBlockPeriod=10;//start of new reward period
    uint rewardPnlPercentage=5000;//50% of pnl for reward

    uint MMR=500; //5% or .005 mmr used to calculate minimum margin requirments for liquidiation

    address public USDC;
    address public Vault;

    struct Snapshot {
        uint startBlock;
        uint endBlock;
        int pnlForReward;
        int pnlRemaining;
        int pnlForSnapshot;
        uint tokensClaimed;
    }
    // mapping(uint=> mapping(address=>uint)) public snapshotTokenStakes;
    mapping(uint=> mapping(address=>bool)) public snapshotHasClaimedReward;
    mapping(uint=> mapping(address=>uint)) public cannotTakeFromStake; //curentStake-user = cannotTakeReward

    Snapshot[] public snapshots;
    constructor(
        string memory _name,
        string memory _symbol,
        // address _vault,
        address _usdc
    ) PoolERC20(_name, _symbol) {
        // Vault = _vault;
        USDC = _usdc;
        Snapshot memory snap = Snapshot({startBlock:block.number,
            endBlock:block.number+rewardBlockPeriod,
            pnlForReward:0,
            pnlRemaining:0,
            pnlForSnapshot:0,
            tokensClaimed:0});
        snapshots.push(snap);
    }


function getSnapshot(uint index)public view returns(Snapshot memory){
    return snapshots[index];
}
function getAllSnaps()public view returns(Snapshot[] memory){
    return snapshots;
}


    function claimReward()external{
        
        require(snapshots.length>0,"No snapshots");
        require(rewardsIndex<currentIndexForNewSnapshots,"No rewards yet wait another period");
        Snapshot memory snapshot = snapshots[rewardsIndex];
        
        //  IERC20 usdc = IERC20(USDC); 
        if(block.number <= snapshot.endBlock + rewardBlockPeriod){
            snapshot = snapshots[++rewardsIndex];
            currentIndexForNewSnapshots++;
        }
        require(snapshot.pnlRemaining>0,"No rewards left or negative");

        require(snapshotHasClaimedReward[rewardsIndex][msg.sender] == false, "Reward already claimed");
        snapshotHasClaimedReward[rewardsIndex][msg.sender] = true;
        uint amountOfTok =balanceOf(msg.sender)  - cannotTakeFromStake[rewardsIndex][msg.sender];
        uint reward = amountOfTok* uint(snapshot.pnlRemaining) / balanceOf(msg.sender);
        snapshot.pnlRemaining -= int(reward);
        snapshot.tokensClaimed += amountOfTok;
       snapshots[rewardsIndex] = snapshot;
        /**
         * will be taken from vault which will hold pnl for rewards
         * might have function on vault for this
         */
        // usdc.transferFrom(vault,msg.sender, reward);

    }
    function stake(uint _usdcAmt)external returns(uint _pkTok) {
        IERC20 usdc = IERC20(USDC); 
    require(usdc.transferFrom(msg.sender,address(this),_usdcAmt), "Transfer failed");
    
    uint tUsdcS= totalUsdcSupply>0?totalUsdcSupply:1;
    uint ts = totalSupply()>0?totalSupply():1;

    uint pTokMint = (_usdcAmt / tUsdcS)*ts;
    _mint(msg.sender,pTokMint);
    totalUsdcSupply += _usdcAmt;

    //check if need new snapshot
    if(snapshots.length == 0){
        //create new snapshot
        createNewStruct();
    }
     Snapshot memory snapshot = snapshots[currentIndexForNewSnapshots];
    if(block.number >= snapshot.endBlock){
        //create new snapshot
    createNewStruct();
    snapshot = snapshots[currentIndexForNewSnapshots];
    }
     cannotTakeFromStake[currentIndexForNewSnapshots][msg.sender] += pTokMint;
    updateUsdcSupply();
           snapshots[rewardsIndex] = snapshot;
    return 0;
    
    }

    function withdrawStake(uint _pTokAmt)public {
    IERC20 usdc = IERC20(USDC); 
    require(balanceOf(msg.sender) >= _pTokAmt,"You cannot unstake more tokens than you have");
    uint tokenBal = totalSupply();
    uint usdcAmt = (totalUsdcSupply/tokenBal)*_pTokAmt;
    if(loanedUsdc !=0){
        uint outToLoanPercentage = loanedUsdc/(totalUsdcSupply-usdcAmt)*100;
        require(maxLoan >= outToLoanPercentage,"Must wait for loans to be repayed for withdraw this amount");
    }
    require(usdcAmt <= availableUsdc,'Not enough available USDC for withdraw');
    _burn(msg.sender,_pTokAmt);
    usdc.transfer(msg.sender,usdcAmt);
    totalUsdcSupply -= usdcAmt;
    updateUsdcSupply();


    }
    function calcPKWorth(uint _pkTokAmt)public view returns(uint){
        uint tokenBal = totalSupply();
        uint usdcAmt = (totalUsdcSupply/tokenBal)*_pkTokAmt;
        return usdcAmt;
    }
    function createNewStruct()internal{
        Snapshot memory snapshot =snapshots[currentIndexForNewSnapshots];
        currentIndexForNewSnapshots++;
        Snapshot memory snap =snapshots[currentIndexForNewSnapshots];
        snap.startBlock = snapshot.endBlock+1;
        snap.endBlock = snapshot.startBlock + rewardBlockPeriod;
        currentIndexForNewSnapshots == 0?rewardsIndex:  rewardsIndex++;
        snapshots.push(snap);
            //remainder of usdc will be taken from vault holdings and given to the pool totalUsdc;
            updateUsdcSupply();
    }

    function updateUsdcSupply()internal{
        IERC20 usdc = IERC20(USDC);
        totalUsdcSupply = usdc.balanceOf(address(this));
        availableUsdc = totalUsdcSupply - loanedUsdc;
    }
    

    function receiveUSDC(uint _amt)public{
        IERC20 usdc = IERC20(USDC); 
    uint allowedAmt = usdc.allowance(msg.sender,address(this));
    require(allowedAmt >= _amt, "Must approve contract to send usdc");
        usdc.transferFrom(msg.sender,address(this),_amt);
        updateUsdcSupply();
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////Dao Functions////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // rewardPnlPercentage
    function setRewardPnlPercentage(uint _rewardPnlPercentage) external  {
        rewardPnlPercentage = _rewardPnlPercentage;
    }
    // maxLoan
    function setMaxLoan(uint _maxLoan) external  {
        maxLoan = _maxLoan;
    }
    // loanInterestRate
    function setLoanInterestRate(uint _loanInterestRate) external  {
        loanInterestRate = _loanInterestRate;
    }
    // rewardBlockPeriod
    function setRewardBlockPeriod(uint _rewardBlockPeriod) external  {
        rewardBlockPeriod = _rewardBlockPeriod;

    }
}