// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PoolErc20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../FakeVault.sol";

import "hardhat/console.sol";

contract StakingPoolAmm is PoolERC20 {


        uint public totalUsdcSupply;
    uint public loanedUsdc;
    uint public availableUsdc;
    uint public maxLoan =700000;//70% of total usdc
    uint public loanInterestRate =10000;//1% interest rate
    uint currentIndexForNewSnapshots=0;
    uint public rewardsIndex=0;
    uint public rewardBlockPeriod=10;//start of new reward period
    uint rewardPnlPercentage=500000;//50% of pnl for reward



    address public USDC;
    address public Vault;


    struct Snapshot {
        uint startBlock;
        uint endBlock;
        uint rewardsCuttOffBlock;
        int pnlForReward;
        int pnlRemaining;
        int pnlForSnapshot;
        uint tokensClaimed;
        uint totalTokenSupply;
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
            rewardsCuttOffBlock:block.number+rewardBlockPeriod + rewardBlockPeriod+1,
         totalTokenSupply:0,

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
    Snapshot memory snapshot = snapshots[rewardsIndex];
    if(block.number > snapshot.endBlock ){
        if(block.number <= snapshot.rewardsCuttOffBlock){
            internalClaimRewards(msg.sender); 
        }else if(block.number > snapshots[currentIndexForNewSnapshots].endBlock){
            updateAndGetCurrentIndex();
            if(block.number <= snapshots[rewardsIndex].rewardsCuttOffBlock){
                internalClaimRewards(msg.sender);
            }else{
                revert("No rewards yet");
            }
        }else{
            revert("No rewards yet");
        }
    }else{
        revert("No rewards yet");
    }  
}

function internalClaimRewards(address _user)internal{
    Snapshot memory snapshot = snapshots[rewardsIndex];

    if(snapshotHasClaimedReward[rewardsIndex][_user] == false && snapshot.pnlRemaining > 0){
        uint userTokens = balanceOf(_user);
        if(userTokens > 0){
            uint tokensAvaibleForReward;
            uint userLockedTokens = rewardsIndex==0?0:cannotTakeFromStake[rewardsIndex][_user];
            if(userLockedTokens > 0){
                if(userTokens > userLockedTokens){
                    tokensAvaibleForReward = userTokens-userLockedTokens;
                }else{
                    revert("No tokens to claim this snapshot");
                }
            }else{
                tokensAvaibleForReward = userTokens;
            }
            uint reward = (uint(snapshot.pnlForReward)*tokensAvaibleForReward)/snapshot.totalTokenSupply;
            snapshotHasClaimedReward[rewardsIndex][_user] = true;
            snapshot.tokensClaimed += tokensAvaibleForReward;
            snapshot.pnlRemaining -= int(reward);
            snapshots[rewardsIndex] = snapshot;
            FakeVault vault = FakeVault(Vault);
            vault.takeReward(reward,_user,rewardsIndex);
        }
    }else {
        revert("User has already claimed reward");
    }
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
            if(snapshots.length-1 > currentIndexForNewSnapshots){
                currentIndexForNewSnapshots++;
                snapshot = snapshots[currentIndexForNewSnapshots];

            }else{
            //create new snapshot
            createNewStruct();
            snapshot = snapshots[currentIndexForNewSnapshots];}
        }

        if(currentIndexForNewSnapshots > 0){
            cannotTakeFromStake[currentIndexForNewSnapshots][msg.sender] += pTokMint;
        }

        snapshot.totalTokenSupply += pTokMint;
        updateUsdcSupply();
            snapshots[currentIndexForNewSnapshots] = snapshot;
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
        Snapshot memory snapshot = snapshots[currentIndexForNewSnapshots];
        snapshot.totalTokenSupply -= _pTokAmt;
        snapshots[currentIndexForNewSnapshots]=snapshot;
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
        uint _newEndBlock = block.number+rewardBlockPeriod+1;
        uint _newRewardsCuttOffBlock = _newEndBlock + rewardBlockPeriod;
        uint _newStartBlock = block.number+1;
        Snapshot memory snap; 
        snap.startBlock=_newStartBlock;
        snap.endBlock=_newEndBlock;
        snap.rewardsCuttOffBlock=_newRewardsCuttOffBlock;
        snap.pnlForReward=0;
        snap.pnlRemaining=0;
        snap.pnlForSnapshot=0;
        snap.totalTokenSupply=totalSupply();
        snap.tokensClaimed=0;
    
        currentIndexForNewSnapshots++;
        rewardsIndex = currentIndexForNewSnapshots-1;

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
    function takeInterest(uint _amt)public{
        IERC20 usdc = IERC20(USDC); 
        usdc.transferFrom(msg.sender,address(this),_amt);
        Snapshot memory snapshot = snapshots[currentIndexForNewSnapshots];
        snapshot.pnlRemaining += int(_amt);
        snapshot.pnlForReward += int(_amt);
        snapshot.pnlForSnapshot += int(_amt);
        snapshots[currentIndexForNewSnapshots] = snapshot;
        availableUsdc += _amt;
        updateUsdcSupply();
    }
    function updateAndGetCurrentIndex()public returns(uint){
        Snapshot memory snapshot = snapshots[currentIndexForNewSnapshots];
        if(block.number >= snapshot.endBlock && snapshots.length-1 > currentIndexForNewSnapshots){
            //create new snapshot
            createNewStruct();
        }
        return currentIndexForNewSnapshots;
    }
    function getAllSnapshots()public view returns(Snapshot[] memory){
        return snapshots;
    }

    function getRewardIndexForBlock()public view returns(uint){
        uint _bNum = block.number;
        for(uint i = 0; i < snapshots.length; i++){
           if(snapshots[i].endBlock < _bNum && snapshots[i].rewardsCuttOffBlock > _bNum){
               return i;
           }
        }
        return 0;
    }





    function getCurrentindex()external view returns(uint){
        return currentIndexForNewSnapshots;
    }
}