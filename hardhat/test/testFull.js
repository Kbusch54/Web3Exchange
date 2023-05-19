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
// const exchnageAbi = require("../artifacts/contracts/daos/Exchange.sol/Exchange.json");
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
    const Theseus = await hre.ethers.getContractFactory('TheseusDAO');
    //votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage
    const votingTime = time.duration.hours(2);
    const maxVotingPower = ethers.constants.MaxUint256;
    const minVotingPower = 1;
    const InsuranceFund = ethers.utils.parseUnits("250000", 6);
    const votesNeededePercentage = 7500;//75%
    const theseus = await Theseus.deploy(votingTime, maxVotingPower, minVotingPower,InsuranceFund, votesNeededePercentage,usdc.address);
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
    
    const uniQuoteAsset = ethers.utils.parseUnits("1", 6);
    const indexPricePeriod = time.duration.hours(4);
    await teslaAmm.init(teslaBytes,teslaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);
    await googleAmm.init(googleBytes,googlePriced,uniQuoteAsset,indexPricePeriod,exchange.address);
    await metaAmm.init(metaBytes,metaPriced,uniQuoteAsset,indexPricePeriod,exchange.address);
    
    //testing purposes
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    await ammViewer.setPriceMap(teslaBytes,parseUnits("300", 8));
    await ammViewer.setPriceMap(googleBytes,parseUnits("1590", 8));
    await ammViewer.setPriceMap(metaBytes,parseUnits("190", 8));
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    console.log('all vamms initiailzed');
    //adding vamm's to other contracts

    //adding amm's to exchange and staking 
    const tokenIDForTesla = await exchange.callStatic.addAmm(teslaAmm.address);
    await exchange.addAmm(teslaAmm.address);
    const tokenIdForGoogle = await exchange.callStatic.addAmm(googleAmm.address);
    await exchange.addAmm(googleAmm.address);
    const tokenIdForMeta = await exchange.callStatic.addAmm(metaAmm.address);
    await exchange.addAmm(metaAmm.address);

        console.log(tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta);
    //creating ariadnes
    const teslaAriadneAddress =  await createAriadnes.computedAddress('tesla');
await createAriadnes.create2('tesla',teslaAmm.address,tokenIDForTesla);
const googleAriadneAddress = await createAriadnes.computedAddress('google');
await createAriadnes.create2('google',googleAmm.address,tokenIdForGoogle);
const metaAriadneAddress = await createAriadnes.computedAddress('meta');
await createAriadnes.create2('meta',metaAmm.address,tokenIdForMeta)


    console.log('ariadnes created');
    //loan pool adding amm's
    await loanPool.initializeVamm(teslaAmm.address,teslaAriadneAddress);
    await loanPool.initializeVamm(googleAmm.address,googleAriadneAddress);
    await loanPool.initializeVamm(metaAmm.address,metaAriadneAddress);

    console.log('loan pool amms initialized');
    //amm viewer add amm's
    await ammViewer.addAmm(teslaAmm.address,'tesla','tsla',teslaBytes);
    await ammViewer.addAmm(googleAmm.address,'google','goog',googleBytes);
    await ammViewer.addAmm(metaAmm.address,'meta','meta',metaBytes);
    console.log('amm viewer amms added');

    //update theseus address
    await ammViewer.updateTheseusDao(theseus.address);
    await staking.updateTheseus(theseus.address);
    await loanPool.setTheseusDao(theseus.address);
    await exchange.updateTheseus(theseus.address);

    console.log('theseus updated');

    await theseus.addStaking(staking.address);
    await theseus.addPoolTokens(poolTokens.address);
    await theseus.addExchange(exchange.address);


    await usdc.transfer(theseus.address,parseUnits("250000", 6));


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
          },
          {
            "internalType": "address",
            "name": "_usdc",
            "type": "address"
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
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "depositFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
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
            "internalType": "address",
            "name": "_exchange",
            "type": "address"
          }
        ],
        "name": "updateExchange",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "inputs": [],
        "name": "usdc",
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
      input,abi
      ) => {
        let iface = new ethers.utils.Interface(abi);
        
        return iface.encodeFunctionData(methodName,input);
      };
    const decodeCallData = (calldata, value,abi) => {
      const data = calldata.toString();
      //  ethers.BigNum
    
      let val = parseInt(value);
    
      const iface = new ethers.utils.Interface(abi);
      let decodedData = iface.parseTransaction({
        data: data,
        value: val,
      });
      return decodedData;
    };
    const decodeTransaction = (methodName, transactionCalldata,abi) => {
      let iface = new ethers.utils.Interface(abi);
      return iface.decodeFunctionData(methodName, transactionCalldata);
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

const sign = async(hash) => {
  const signature = await owner.provider.send("personal_sign", [hash, owner.address])
  return signature;
}


const exhcnageAbi = await hre.ethers.getContractFactory("Exchange");
const exchangeABI = exhcnageAbi.interface.format(); 

const loanPoolCon= await hre.ethers.getContractFactory("LoanPool");
const loanPoolABI = loanPoolCon.interface.format();

const ariadneCon = await hre.ethers.getContractFactory("AriadneDAO");
const ariadneABI = ariadneCon.interface.format();
console.log('const ariadneTesla =',teslaAriadneAddress);
console.log('const ariadneGoogle =',googleAriadneAddress);
console.log('const ariadneMeta =',metaAriadneAddress);
console.log("const createAriadnes = ",createAriadnes.address);
console.log("const TeslaAmm = ",teslaAmm.address);
console.log("const GoogleAmm = ",googleAmm.address);
console.log("const MetaAmm = ",metaAmm.address);
console.log("const ammViewer = ",ammViewer.address);
console.log("const loanpool = ",loanPool.address);
console.log("const staking = ",staking.address);
console.log("const exchange = ",exchange.address);
console.log("const theseus = ",theseus.address);
console.log("const poolTokens = ",poolTokens.address);
console.log("const usdc = ",usdc.address);
console.log("const payload = ",payload.address);
console.log("const exchangeViewer = ",exchangeViewer.address);
        return { 
    owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,
    staking,ammViewer,teslaAmm,googleAmm,metaAmm,createAriadnes,payload,
    exchangeViewer,teslaAriadneAddress,googleAriadneAddress,ariadneABI,metaAriadneAddress,tokenIDForTesla,tokenIdForGoogle,tokenIdForMeta,sign,getFunctionCallData,decodeCallData,decodeTransaction,getMethodNameHash,ABI,getTransactionHash,loanPoolABI,exchangeABI
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
it.skip('should stake and allow theseus dao vote',async function(){
    const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,staking,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
    await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
    await exchange.deposit(ethers.utils.parseUnits("1000", 6));
    await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);
    const votesNeeded = await theseus.callStatic.votesNeededPercentage();

    const newVotesNeededPercentage = 9500; // Example value
// const transactionhash = getMethodNameHash(newVotesNeededPercentage, 0, "updateSignaturesRequired", theseus.address);
    const callData = getFunctionCallData('updateSignaturesRequired', [newVotesNeededPercentage],ABI);
      console.log('callData',callData);
    // console.log('transaction hash',transactionhash);
    await theseus.newProposal(theseus.address,callData);
    const proposal = await theseus.callStatic.proposals(0);

   
    const transactionHash  = getTransactionHash(0,theseus.address,0,callData,theseus.address)
    const signature = await sign(transactionHash);
    console.log('signature',signature);
    let signatures = [signature];
    await theseus.executeTransaction(0,theseus.address,0,callData,signatures);
  

    const postProposal = await theseus.callStatic.proposals(0);

    const newVotesPercentage = await theseus.callStatic.votesNeededPercentage();




      const callData2 = getFunctionCallData('setMinAndMaxTradingFee', [20000,80000], loanPoolABI);

    await theseus.newProposal(loanPool.address,callData2);
    const transactionHash2 = getTransactionHash(1,loanPool.address,0,callData2,theseus.address)
    const signatureFor2 = await sign(transactionHash2);
    let signatures2 = [signatureFor2];


    await theseus.executeTransaction(1,loanPool.address,0,callData2,signatures2);

    const minTradingFeepost = await loanPool.callStatic.minTradingFeeLimit();

    const maxTradingFeepost = await loanPool.callStatic.maxTradingFeeLimit();
    const postPropsal2 = await theseus.callStatic.proposals(1);
    expect(minTradingFeepost).to.equal(20000);
    expect(maxTradingFeepost).to.equal(80000);
    expect(newVotesPercentage).to.equal(newVotesNeededPercentage);
    expect(postProposal.isProposalPassed).to.equal(true);
    expect(postPropsal2.isProposalPassed).to.equal(true);
    expect(votesNeeded).to.not.equal(newVotesPercentage);
});
it.skip('should stake and allow ariadne dao vote',async function(){

  const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,ariadneABI,staking,teslaAriadneAddress,teslaAmm,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
  await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
  await exchange.deposit(ethers.utils.parseUnits("1000", 6));
  await staking.stake(ethers.utils.parseUnits("1000", 6),teslaAmm.address);

  // const teslaAriadne = await hre.ethers.getContractFactory("AriadneDAO");
  const teslaAriadne = new ethers.Contract( teslaAriadneAddress,ariadneABI, owner);
  const prevVotingTime = await teslaAriadne.callStatic.votingTime();
  const newVotingTime = prevVotingTime+900;


  const tokenIDForTesla = await staking.callStatic.ammPoolToTokenId(teslaAmm.address);
  const callData = getFunctionCallData('updateVotingTime', [newVotingTime],ariadneABI);
  //updateVotingTime
  await teslaAriadne.newProposal(teslaAriadneAddress,callData);
  const proposal = await teslaAriadne.callStatic.proposals(0);
  const transactionHash  = getTransactionHash(0,teslaAriadneAddress,0,callData,teslaAriadneAddress);
  const signature = await sign(transactionHash);
  let signatures = [signature];
  await teslaAriadne.executeTransaction(0,teslaAriadneAddress,0,callData,signatures);
  const postProposal = await teslaAriadne.callStatic.proposals(0);
  const newVotingTimePost = await teslaAriadne.callStatic.votingTime();
  expect(newVotingTimePost).to.equal(newVotingTime);
  expect(postProposal.isProposalPassed).to.equal(true);
  expect(prevVotingTime).to.not.equal(newVotingTimePost);
});
it.skip('should stake and allow ariadne dao vote on other contracts',async function(){
  const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,ariadneABI,staking,teslaAriadneAddress,teslaAmm,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
  await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
  await exchange.deposit(ethers.utils.parseUnits("1000", 6));
  await staking.stake(ethers.utils.parseUnits("1000", 6),teslaAmm.address);

  const avaiableUSDC = await exchange.callStatic.poolAvailableUsdc(teslaAmm.address);
  const totalUSDC = await exchange.callStatic.poolTotalUsdcSupply(teslaAmm.address);
  console.log('avaiableUSDC',formatUnits(avaiableUSDC,6));
  console.log('totalUSDC',formatUnits(totalUSDC,6));
  
  const teslaAriadne = new ethers.Contract( teslaAriadneAddress,ariadneABI, owner);

  const previnterestPeriods = await loanPool.callStatic.interestPeriods(teslaAmm.address);
  const newInterestPeriod = time.duration.hours(6);

  const callData = getFunctionCallData('setInterestPeriods', [newInterestPeriod,teslaAmm.address], loanPoolABI);
  await teslaAriadne.newProposal(loanPool.address,callData);
  const proposal = await teslaAriadne.callStatic.proposals(0);
  const transactionHash  = getTransactionHash(0,loanPool.address,0,callData,teslaAriadneAddress);
  const signature = await sign(transactionHash);
  let signatures = [signature];
  await teslaAriadne.executeTransaction(0,loanPool.address,0,callData,signatures);
  const postProposal = await teslaAriadne.callStatic.proposals(0);
  const newInterestPeriodPost = await loanPool.callStatic.interestPeriods(teslaAmm.address);
  expect(newInterestPeriodPost).to.equal(newInterestPeriod);
  expect(postProposal.isProposalPassed).to.equal(true);
  expect(previnterestPeriods).to.not.equal(newInterestPeriodPost);
  const ammOnDAO = await teslaAriadne.callStatic.amm();
  expect(ammOnDAO).to.equal(teslaAmm.address)

  const theseusDaaoUSDCBalance = await usdc.balanceOf(theseus.address);
  console.log('theseusDaaoUSDCBalance',formatUnits(theseusDaaoUSDCBalance,6));

});
it('should stake and allow theseus to transfer usdc to user',async function(){
  const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,staking,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
  await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
  await exchange.deposit(ethers.utils.parseUnits("1000", 6));
  await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);

  const theseusUSDCBalance = await usdc.balanceOf(theseus.address);
console.log('theseusUSDCBalance',formatUnits(theseusUSDCBalance,6));
  const tokenABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_totalSupply",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_decimals",
          "type": "uint8"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
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
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "addOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
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
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
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
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "faucet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "mintAndTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "owners",
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
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
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
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const amount = ethers.utils.parseUnits("250000", 6);

  // await usdc.transfer(theseus.address,amount);
  const daobalance = await usdc.balanceOf(theseus.address);
  console.log('daobalance',formatUnits(daobalance,6));
  console.log('owner add',owner.address);
  const calldata = getFunctionCallData('transfer', [owner.address,amount],tokenABI);
  // const decodedData = decodeCallData(calldata,[owner.address,amount],tokenABI);
  // console.log('decodedData',decodedData);
  await theseus.newProposal(usdc.address,calldata);
  // const proposal = await theseus.callStatic.proposals(0);
  const transactionHash  = await theseus.callStatic.getTransactionHash(0,usdc.address,0,calldata);
  console.log('transactionHash',transactionHash);
  const transactionHashFile = getTransactionHash(0,usdc.address,0,calldata,theseus.address);
  console.log('transactionHashFile',transactionHashFile);
  const signature = await sign(transactionHash);
  // const newSig = await owner.signTransaction(transactionHash);
  const recovered = await theseus.callStatic.recover(transactionHash,signature);
  console.log('recovered',recovered);
  console.log('owner....',owner.address);




  let signatures = [signature];
  await theseus.executeTransaction(0,usdc.address,0,calldata,signatures);

  const postUsdcBal = await usdc.balanceOf(theseus.address);
  console.log('postUsdcBal',formatUnits(postUsdcBal,6));
  // const postProposal = await theseus.callStatic.proposals(0);
  // const exchangeUSDCBalanceForTheseus = await exchange.availableBalance(theseus.address);
  // console.log('available usdc baance: $',formatUnits(exchangeUSDCBalanceForTheseus,6));
  // expect(exchangeUSDCBalanceForTheseus).to.equal(theseusUSDCBalance);
  // expect(postProposal.isProposalPassed).to.equal(true);
  const newCallDtat = getFunctionCallData('transfer', ['0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42',amount],tokenABI);
  console.log('newCallDtat',newCallDtat);

});
it('should stake and allow theseus to deposit usdc in vault',async function(){
  const {owner, otherAccount,usdc,exchange,theseus,poolTokens,loanPool,staking,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
  await usdc.approve(exchange.address,ethers.utils.parseUnits("1000", 6));
  await exchange.deposit(ethers.utils.parseUnits("1000", 6));
  await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);

  const theseusUSDCBalance = await usdc.balanceOf(theseus.address);

  const calldata = getFunctionCallData('depositFunds', [theseusUSDCBalance],ABI);
  await theseus.newProposal(exchange.address,calldata);
  const proposal = await theseus.callStatic.proposals(0);
  const transactionHash  = getTransactionHash(0,theseus.address,0,calldata,theseus.address);
  const signature = await sign(transactionHash);
  let signatures = [signature];
  await theseus.executeTransaction(0,theseus.address,0,calldata,signatures);
  const postProposal = await theseus.callStatic.proposals(0);
  const exchangeUSDCBalanceForTheseus = await exchange.availableBalance(theseus.address);
  console.log('available usdc baance: $',formatUnits(exchangeUSDCBalanceForTheseus,6));
  expect(exchangeUSDCBalanceForTheseus).to.equal(theseusUSDCBalance);
  expect(postProposal.isProposalPassed).to.equal(true);

});

it.skip('should allow open position on tesla amm',async function(){
  const {owner, otherAccount,ammViewer,teslaAmm,usdc,exchange,theseus,poolTokens,loanPool,staking,ABI,loanPoolABI,exhcnageABI,sign,getFunctionCallData,getMethodNameHash,getTransactionHash,decodeCallData,decodeTransaction}=await loadFixture(deployContracts);
  await usdc.approve(exchange.address,ethers.utils.parseUnits("5000", 6));
  await exchange.deposit(ethers.utils.parseUnits("5000", 6));
  await staking.stake(ethers.utils.parseUnits("1000", 6),theseus.address);
  await staking.stake(ethers.utils.parseUnits("3000", 6),teslaAmm.address);


  const quoteAssets1 = await teslaAmm.callStatic.getQuoteReserve();
  console.log('quoteAssets: $',quoteAssets1);

  const prevUserBal = await exchange.availableBalance(owner.address);
  const collateral = parseUnits("250", 6);
  const leverage = 3;
  const side = 1;
  await ammViewer.updateQuoteAssetStarter(teslaAmm.address,100);
  await exchange.openPosition(teslaAmm.address, collateral, leverage, side);
  const loanAmount = collateral.mul(leverage);
  const tradeIds = await exchange.callStatic.getTradeIds(owner.address);
  const position = await exchange.callStatic.positions(tradeIds[0]);
  console.log("positioon", position);
  const postUserBal = await exchange.availableBalance(owner.address);
  const tradingFee = await loanPool.callStatic.tradingFeeLoanPool(teslaAmm.address);
  console.log('tradingFee',formatUnits(tradingFee,0));
  const expectedFee = loanAmount.mul(tradingFee).div(ethers.utils.parseUnits("10", 5));
  console.log('expectedFee',formatUnits(expectedFee,6));
  const expectedPostUserBal = prevUserBal.sub(collateral).sub(expectedFee);
  console.log('expectedPostUserBal: $',formatUnits(expectedPostUserBal,6));
  expect(postUserBal).to.equal(expectedPostUserBal);

  console.log('previous balance: $',formatUnits(prevUserBal,6));
  console.log('post balance: $',formatUnits(postUserBal,6));
  const marketPrice = await teslaAmm.callStatic.getAssetPrice();
  console.log('marketPrice: $',formatUnits(marketPrice,6));
  const indexPrice = await teslaAmm.callStatic.indexPrice();
  console.log('indexPrice: $',formatUnits(indexPrice,6));

  const quoteAssets = await teslaAmm.callStatic.getQuoteReserve();
  console.log('quoteAssets: $',quoteAssets);
  const remainder = quoteAssets.sub(position.positionSize);
  console.log('remainder: #',formatUnits(remainder,8));


  await exchange.closeOutPosition(tradeIds[0]);
  const postQuoteAssets = await teslaAmm.callStatic.getQuoteReserve();
  console.log('postQuoteAssets: $',formatUnits(postQuoteAssets,6));
  const postPosition = await exchange.callStatic.positions(tradeIds[0]);
  console.log("postPosition", postPosition);
  console.log('new balance: $',formatUnits(await exchange.availableBalance(owner.address),6));
});



});
