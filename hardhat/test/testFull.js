const { WrapperBuilder } = require("@redstone-finance/evm-connector");
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");
const { expect,chai } = require("chai");
// const theseusDaoAbi = require("../artifacts/contracts/daos/TheseusDAO.sol/TheseusDAO.json");
const { ethers } = require("ethers");
const hre = require("hardhat");
const {
    loadFixture,
    mine,
    takeSnapshot,
    time,
  } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
describe("Testing Full deployment", function () {
    async function deployContracts() {
        const [owner, otherAccount,payload] =await hre.ethers.getSigners();
        const USDC = await hre.ethers.getContractFactory("FakeUsdc");
    const totalSupply = ethers.utils.parseUnits("500000", 6);
    const usdcName = 'USDC';
    const usdcSymbol = 'USDC';
    const usdcDecimals = 6;
    const usdc = await USDC.deploy(totalSupply,usdcName,usdcSymbol,usdcDecimals);
    await usdc.deployed();
    console.log('usdc deployed  ',usdc.address);
    const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
    //votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
    const votingTime = time.duration.hours(2);
    const maxVotingPower = parseUnits("100000000", 20);
    const minVotingPower = 10000;
    const InsuranceFund = ethers.utils.parseUnits("250000", 6);
    const votesNeededePercentage = 7500;//75%
    const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage);
    await theseus.deployed();
    // console.log('theseus deployed  ',theseus.address);
    const Staking = await hre.ethers.getContractFactory('Staking');
    const staking = await Staking.deploy();
    await staking.deployed();
    // console.log('staking deployed  ',staking.address);
    const PoolTokens = await hre.ethers.getContractFactory('PoolTokens');
    const poolTokens = await PoolTokens.deploy(staking.address);
    await poolTokens.deployed();
    // console.log('poolTokens deployed  ',poolTokens.address);
    const CreateAriadnes = await hre.ethers.getContractFactory('CreateAriadnes');
    const createAriadnes = await CreateAriadnes.deploy(votingTime,maxVotingPower,minVotingPower,votesNeededePercentage,staking.address,poolTokens.address);
    await createAriadnes.deployed();
    // console.log('createAriadnes deployed  ',createAriadnes.address);
    const Exchange = await hre.ethers.getContractFactory('Exchange');
    const exchange = await Exchange.deploy(usdc.address,staking.address);
    await exchange.deployed();
    // console.log('exchange deployed  ',exchange.address);
    const LoanPool = await hre.ethers.getContractFactory('LoanPool');
    const loanPool = await LoanPool.deploy(exchange.address);
    await loanPool.deployed();
    // console.log('loanPool deployed  ',loanPool.address);
    const minInterestRate = 10000;
    const maxInterestRate = 100000;
    const minLoanAmount = ethers.utils.parseUnits("100", 6);
    const maxLoanAmount = ethers.utils.parseUnits("1000", 6);
    //setting up loan pool
    const minMMR = 50000;
    const maxMMR = 100000;
    const minHoldingRequirments = 5; // 20%
    const maxHoldingsReq = 20; // 5% 
    const minTradingFees = 10000;
    const maxTradingFees =100000;
    const minInterestRatePeriod = time.duration.hours(1);
    const maxInterestRatePeriod = time.duration.hours(8);
    await loanPool.setMinAndMaxInterestRate(minInterestRate,maxInterestRate);
    await loanPool.setMinAndMaxLoan(minLoanAmount,maxLoanAmount);
    await loanPool.setMinAndMaxMMR(minMMR,maxMMR);
    await loanPool.setMinAndMaxMinHoldingsReqPercentage(minHoldingRequirments,maxHoldingsReq);
    await loanPool.setMinAndMaxTradingFee(minTradingFees,maxTradingFees);
    await loanPool.setMinAndMaxInterestPeriods(minInterestRatePeriod,maxInterestRatePeriod);
    await staking.setExchange(exchange.address);
    await staking.setPoolToken(poolTokens.address);
    //exhcnage viewer
    const ExchangeViewer = await hre.ethers.getContractFactory('ExchangeViewer');
    const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address,exchange.address,theseus.address);
    await exchangeViewer.deployed();
    await exchange.setExchangeViewer(exchangeViewer.address);
    await exchange.registerLoanPool(loanPool.address);

    // console.log('exchangeViewer deployed  ',exchangeViewer.address);

    //payload
    // const Payload = await hre.ethers.getContractFactory('Payload');
    // const payload = await Payload.deploy();
    // await payload.deployed();

    //amm viewer
    const unsignedMetadata = "manual-payload";
    const redstonePayload = await sdk.requestRedstonePayload(
        {
          dataServiceId: "redstone-main-demo",
          uniqueSignersCount: 1,
          dataFeeds: ["TSLA","META","GOOG"],
        },
        ["https://d33trozg86ya9x.cloudfront.net"],
        unsignedMetadata
      );
    const AmmViewer = await hre.ethers.getContractFactory('TestAmmViewer');
    const ammViewer = await AmmViewer.deploy(payload.address,`0x${redstonePayload}`);
    await ammViewer.deployed();

    console.log('ammViewer deployed  ',ammViewer.address);
    //deploying and setting vamm * 3
    const VAmm = await hre.ethers.getContractFactory('VAmm');
    const teslaAmm = await VAmm.deploy(ammViewer.address);
    await teslaAmm.deployed();
    const googleAmm = await VAmm.deploy(ammViewer.address);
    await googleAmm.deployed();
    const metaAmm = await VAmm.deploy(ammViewer.address);
    await metaAmm.deployed();
    const teslaBytes = ethers.utils.formatBytes32String("TSLA");
    const googleBytes = ethers.utils.formatBytes32String("GOOG");
    const metaBytes = ethers.utils.formatBytes32String("META");
    const teslaPriced = parseUnits("370", 6);
    const googlePriced = parseUnits("1500", 6);
    const metaPriced = parseUnits("200", 6);

    const uniQuoteAsset = ethers.utils.parseUnits("10000", 6);
    const indexPricePeriod = time.duration.hours(4);
    await teslaAmm.init(teslaBytes,teslaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await googleAmm.init(googleBytes,googlePriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);
    await metaAmm.init(metaBytes,metaPriced/100,uniQuoteAsset,indexPricePeriod,exchange.address);


    // console.log('all vamms initiailzed');
    //adding vamm's to other contracts

    //staking
    const tokenIDForTesla = await staking.callStatic.addAmmTokenToPool(teslaAmm.address);
    await staking.addAmmTokenToPool(teslaAmm.address);
    const tokenIdForGoogle = await staking.callStatic.addAmmTokenToPool(googleAmm.address);
    await staking.addAmmTokenToPool(googleAmm.address);
    const tokenIdForMeta = await staking.callStatic.addAmmTokenToPool(metaAmm.address);
    await staking.addAmmTokenToPool(metaAmm.address);

        // console.log(tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta);
    //creating ariadnes
    const teslaAriadneAddress = await createAriadnes.callStatic.create2('tesla',teslaAmm.address,tokenIDForTesla);
    await createAriadnes.create2('tesla',teslaAmm.address,tokenIDForTesla);
    const googleAriadneAddress = await createAriadnes.callStatic.create2('google',googleAmm.address,tokenIdForGoogle);
    await createAriadnes.create2('google',googleAmm.address,tokenIdForGoogle);
    const metaAriadneAddress = await createAriadnes.callStatic.create2('meta',metaAmm.address,tokenIdForMeta);
    await createAriadnes.create2('meta',metaAmm.address,tokenIdForMeta);

    // console.log('ariadnes created');
    //loan pool adding amm's
    await loanPool.initializeVamm(teslaAmm.address,teslaAriadneAddress);
    await loanPool.initializeVamm(googleAmm.address,googleAriadneAddress);
    await loanPool.initializeVamm(metaAmm.address,metaAriadneAddress);

    console.log('loan pool amms initialized');
    //amm viewer add amm's
    await ammViewer.addAmm(teslaAmm.address,'tesla','tsla',teslaBytes);
    await ammViewer.addAmm(googleAmm.address,'google','goog',googleBytes);
    await ammViewer.addAmm(metaAmm.address,'meta','meta',metaBytes);
    // console.log('amm viewer amms added');
    //update theseus address
    await ammViewer.updateTheseusDao(theseus.address);
    await staking.updateTheseus(theseus.address);
    await loanPool.setTheseusDao(theseus.address);
    await exchange.updateTheseus(theseus.address);

    console.log('theseus updated');

    await theseus.addStaking(staking.address);
    await theseus.addPoolTokens(poolTokens.address);


    //logging outy the addresses
    // console.log('ariadne tesla',teslaAriadneAddress);
    // console.log('ariadne google',googleAriadneAddress);
    // console.log('ariadne meta',metaAriadneAddress);
    // console.log("Tesla amm",teslaAmm.address);
    // console.log("Google amm",googleAmm.address);
    // console.log("Meta amm",metaAmm.address);
    // console.log("amm viewer",ammViewer.address);
    // console.log("loan pool",loanPool.address);
    // console.log("staking",staking.address);
    // console.log("exchange",exchange.address);
    // console.log("theseus",theseus.address);
    // console.log("pool tokens",poolTokens.address);
    // console.log("usdc",usdc.address);
    // console.log("payload",payload.address);
    // console.log("exchange viewer",exchangeViewer.address);
    // console.log("create ariadnes",createAriadnes.address);
        return { 
    owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
    staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
    exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
}
    }
it.skip("should deploy the contracts", async function () {
    const { 
        owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts)
    console.log('ready to go');
});
it.skip("should deposit and stake", async function () {
    const { 
        owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    const availablebal = await exchange.callStatic.availableBalance(owner.address);
    console.log('available balance',availablebal.toString());
    await staking.stake(availablebal,teslaAmm.address);
    const poolTotalUsdc = await exchange.callStatic.poolTotalUsdcSupply(teslaAmm.address);
    console.log('pool total usdc',formatUnits(poolTotalUsdc,6));
    const poolTotalavailable = await exchange.callStatic.poolAvailableUsdc(teslaAmm.address);
    console.log('pool total available',formatUnits(poolTotalavailable,6));
    const postStakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post stake balance',formatUnits(postStakeBalance,6));
    const poolTokensBalance = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance,18));
});
it.skip("should withdraw and unstake", async function () {
    const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
        staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
        exchangeViewer,teslaAriadneAddress,googleAriadneAddress,metaAriadneAddress,
        tesla,google,meta,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta
    } = await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    const availablebal = await exchange.callStatic.availableBalance(owner.address);
    console.log('available balance',availablebal.toString());
    await staking.stake(availablebal,teslaAmm.address);
    const poolTotalUsdc = await exchange.callStatic.poolTotalUsdcSupply(teslaAmm.address);
    console.log('pool total usdc',formatUnits(poolTotalUsdc,6));
    const poolTotalavailable = await exchange.callStatic.poolAvailableUsdc(teslaAmm.address);
    console.log('pool total available',formatUnits(poolTotalavailable,6));
    const postStakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post stake balance',formatUnits(postStakeBalance,6));
    const poolTokensBalance = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance,18));
    const amountToBurn = poolTokensBalance.sub(200000);
    console.log('amount to burn',amountToBurn.toString());
    await staking.unStake(amountToBurn,teslaAmm.address);
    const postUnstakeBalance =await exchange.callStatic.availableBalance(owner.address);
    console.log('post Unstake balance',formatUnits(postUnstakeBalance,6));
    const poolTokensBalance2 = await poolTokens.balanceOf(owner.address,tokenIDForTesla);
    console.log('pool tokens balance',formatUnits(poolTokensBalance2,18));

});
it('should stake and allow theseus dao vote',async function(){
    const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,staking}=await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);
    const tokenBalFromTheseus = await theseus.callStatic.isTokenHolder(owner.address);
    console.log('token bal from theseus',tokenBalFromTheseus);
    const votesNeeded = await theseus.callStatic.votesNeededPercentage();
    console.log('votes needed',votesNeeded.toString());

    const newVotesNeededPercentage = 9500; // Example value

    const ABI = [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_votingTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_maxVotingPower",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_minVotingPower",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_insuranceFundMin",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_votesNeededPercentage",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "DUPLICATE_OR_UNORDERED_SIGNATURES",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "INSUFFICIENT_VALID_SIGNATURES",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NOT_OWNER",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NOT_SELF",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NOT_STAKING",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TIME_EXPIRED",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TX_FAILED",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "executor",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "result",
              "type": "bytes"
            }
          ],
          "name": "ExecuteTransaction",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "proposer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "transactionHash",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timeStamp",
              "type": "uint256"
            }
          ],
          "name": "ProposalMade",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_pt",
              "type": "address"
            }
          ],
          "name": "addPoolTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_staking",
              "type": "address"
            }
          ],
          "name": "addStaking",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_tokenHolder",
              "type": "address"
            }
          ],
          "name": "addTokenHolder",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "currentId",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "internalType": "bytes[]",
              "name": "signatures",
              "type": "bytes[]"
            }
          ],
          "name": "executeTransaction",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getCurrentTokenHolders",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_signer",
              "type": "address"
            }
          ],
          "name": "getProportionOfVotes",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTotalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_nonce",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "getTransactionHash",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "insuranceFundMin",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "isProposalPassed",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_signer",
              "type": "address"
            }
          ],
          "name": "isTokenHolder",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "newProposal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "nonceUsed",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "proposalTime",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "proposals",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "proposer",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "result",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "votesFor",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "proposalTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isProposalPassed",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "pt",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_hash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "_signature",
              "type": "bytes"
            }
          ],
          "name": "recover",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "staking",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "tokenHolders",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "totalVotes",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_pt",
              "type": "address"
            }
          ],
          "name": "updatePoolTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "newVotesNeededPercentage",
              "type": "uint256"
            }
          ],
          "name": "updateSignaturesRequired",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_staking",
              "type": "address"
            }
          ],
          "name": "updateStaking",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "votesAgainst",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "votesFor",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "votesNeededPercentage",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "votingTime",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]

    const getTransactionHash = (_nonce, to, value, data, address) => {
        return ethers.utils.solidityKeccak256(
          ["address", "uint256", "address", "uint256", "bytes"],
          [address, _nonce, to, value, data]
        );
      };


      const getFunctionCallData = (
        methodName,
        votesNeeded
      ) => {
        let iface = new ethers.utils.Interface(ABI);
      
        return iface.encodeFunctionData(methodName, [
          votesNeeded
        ]);
      };

const getMethodNameHash = (
  votesNeeded,
  nonce,
  methodName,
  multiAddress
) => {
  let value = "0x0";

  let callData = getFunctionCallData(
    methodName,
    votesNeeded
      );
  return getTransactionHash(
    nonce,
    multiAddress,
    value,
    callData,
    multiAddress,
  );
};

// const transactionhash = getMethodNameHash(newVotesNeededPercentage, 0, "updateSignaturesRequired", theseus.address);
const callData = getFunctionCallData('updateSignaturesRequired', newVotesNeededPercentage);
      console.log('callData',callData);
    // console.log('transaction hash',transactionhash);
    const decodeCallData = (calldata, value) => {
        const data = calldata.toString();
        //  ethers.BigNum
      
        let val = parseInt(value);
      
        const iface = new ethers.utils.Interface(ABI);
        let decodedData = iface.parseTransaction({
          data: data,
          value: val,
        });
        return decodedData;
      };
      const decodeTransaction = (methodName, transactionCalldata) => {
        let iface = new ethers.utils.Interface(ABI);
        return iface.decodeFunctionData(methodName, transactionCalldata);
      };
      const calldatat = decodeTransaction("updateSignaturesRequired", callData);
        console.log('calldatat',calldatat);

        // const signature = await owner.signMessage(callData);

    await theseus.newProposal(theseus.address,callData);
    const proposal = await theseus.callStatic.proposals(0);
    console.log('proposal',proposal);

    const sign = async(hash) => {
        const signature = await owner.provider.send("personal_sign", [hash, owner.address])
        return signature;
    }
    const transactionHash  = getTransactionHash(0,theseus.address,0,callData,theseus.address)
    const signature = await sign(transactionHash);
    console.log('signature',signature);
    let signatures = [signature];
    await theseus.executeTransaction(0,theseus.address,0,callData,signatures);
  
    //     console.log('transaction hash',trasnactionHash);
    //   const verified = await theseus.callStatic.recover(transactionHash, signature);
    //     console.log('verified',verified);

    // const postProposal = await theseus.callStatic.proposals(0);
    // console.log('post proposal',postProposal);



});




});
