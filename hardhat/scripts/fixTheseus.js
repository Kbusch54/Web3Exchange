
const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

    const ABI = [
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
      ]
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);

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
    const signature = await signer.provider.send("personal_sign", [hash, signer.address])
    return signature;
  }
  const amount = ethers.utils.parseUnits("250000", 6);

  const calldata = getFunctionCallData('transfer', [signer.address,amount],ABI);
//   console.log(calldata);
//   console.log('address',signer.address);
//   console.log('amount',amount);
const theseusAddress = '0xc4b9f4e8d1ccbc5fad290840ee8f5fc96479a7d5';
const stakingAddress = '0x37f5CEC042b1E78E8a60cDF5A11867108Ae0b17c';
const exchangeAddress = '0xd98387fC0Dcdf7FF2DF0E252B0E351f608Aad48A';
const loanPoolAddress= '0x31a6314fE6a87EA0F98969765753f7e6573963CF';
const exchangeViewerAddresss='0x17e02A7CDeC532f1CdcC090b8dDBbDD40E512C4f';
const ammviewerAddress = '0x0c2BacF2DB04a25EA5DEF92aB115Ba5770Be3f6E';
const createAriadnesAddress = '0xeA0b45d79DfFf9D0eA96d549d5247700dEa7e149';
const poolTokensAddress = '0x4aA13F7D3618594BfE3171C66E8283c9d7d4eB34';
const payloadAddress='0x487A152E164675219F40Ec5113ee50BEbb5957be';
const usdcAddress = '0x3741fe87b3adb8eda54aee2ea8ffdc9af536a7e9';

//approve and stake usdc
const usdcContract = await ethers.getContractAt('FakeUsdc',usdcAddress);
const exchangeContract = await ethers.getContractAt('Exchange',exchangeAddress);
const stakingContract = await ethers.getContractAt('Staking',stakingAddress);

const deposit = ethers.utils.parseUnits('100',6);
// await usdcContract.approve(exchangeAddress,deposit);
// console.log('approved');
// await exchangeContract.deposit(deposit);
// console.log('deposited');

const oldTheseus = await ethers.getContractAt('TheseusDAO',theseusAddress);
// await stakingContract.stake(deposit,oldTheseus.address);
// console.log('staked');
// let curenid = await oldTheseus.currentId();
// console.log(curenid.toString());
//   await oldTheseus.newProposal(usdcAddress,calldata,{gasLimit: 1000000});

//   curenid = await oldTheseus.currentId();
// console.log(curenid.toString());
// console.log('call data',calldata);
// console.log('signer address',signer.address);
// console.log(oldTheseus)
// console.log('signer',signer.provider);
  const transactionHash  = getTransactionHash(0,usdcContract.address,0,calldata,oldTheseus.address);
  const singableMessage = ethers.utils.arrayify(transactionHash);
 
//   const signature = signer.signMessage(ethers.utils.arrayify(transactionHash));
//   const recovere = await oldTheseus.recover(transactionHash,signature);
//     console.log('recovered',recovere);
//     console.log('signer...',signer.address)
//   console.log('signature',signature);
//   let signatures = [signature];
//   await oldTheseus.executeTransaction(0,usdcAddress,0,calldata,signatures);
  
  
  console.log('executed');
  const proposal = await oldTheseus.proposals(0);
  console.log(proposal);

// transfer usdc to wallet
//deploy theseus
//
//  await ammViewer.updateTheseusDao(theseus.address);
// await staking.updateTheseus(theseus.address);
// await loanPool.setTheseusDao(theseus.address);
// await exchange.updateTheseus(theseus.address);

// console.log('theseus updated');

// await theseus.addStaking(staking.address);
// await theseus.addPoolTokens(poolTokensAddress);
// a wait theseus.addExchange(exchange.address);
const stakingVaslue =  
await stakingContract.unStake()


    }


    main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//0xa9059cbb00000000000000000000000087ad83dc2f12a14c85d20f178a918a65edfe1b420000000000000000000000000000000000000000000000000000003a35294400
//0xa9059cbb00000000000000000000000087ad83dc2f12a14c85d20f178a918a65edfe1b420000000000000000000000000000000000000000000000000000003a35294400