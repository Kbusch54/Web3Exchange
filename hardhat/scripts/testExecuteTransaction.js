const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
   
    const ariadne = await hre.ethers.getContractAt("TheseusDAO","0xA547af463d3A202e0E85CA766FB67eE0395e4D5C",signer);
    const staking = await hre.ethers.getContractAt("Staking","0x0C9dfCBe62a84344fE53B2B39f9dc9906bbdEFC4",signer);

    // const usdc = await hre.ethers.getContractAt("FakeUsdc","0xAADbde5D0ED979b0a88770be054017fC40Bc43d1",signer);

    const toStake = ethers.utils.parseUnits("100", 6);
    await staking.stake(toStake,ariadne.address);


    const signatures = [ "0x41f3ed6178ea12fde9effb8c9b48aa04963e20814810a6ccbf9649fce8760c8074765afd5f729cde9d3445ab5f88ccbab11f6ad5d3f4fa7b0a9f0b16720f0b5b1c"];
    const value='0x0';
    const data ="0xf6890b310000000000000000000000000000000000000000000000000000000000003840";
    const nonce = 0;
    // const transactionHash = await ariadne.getTransactionHash(nonce, ariadne.address, value, data);
    // const trh ='0xa738f8522e6a2e90198d1778182a4d31ae7f1bd3131898c4c5c1cf248d2c5c3d'
    // console.log(transactionHash);
    const tx = await ariadne.newProposal( ariadne.address,data);
    // const proposal = await ariadne.proposals(12);
    // console.log(proposal);
    //0x5101794ff028174a8f785366afeb94b802e900ccf6b2644b612685755196aef4
    //0xc7fcd43cf688d1588deb80c304be562c36039c511b307cf3c6cff528f82d432d
    // uint _id,
    // address payable to,
    // uint256 value,
    // bytes calldata data,
    // bytes[] calldata signatures
    // const customGasLimit = 500000;// Use your existing provider
    // const tx = await ariadne.executeTransaction(nonce, ariadne.address, value, data, signatures,{gasLimit:customGasLimit});
    // console.log(tx);

    // const newVotingTime = await ariadne.votingTime();
    // console.log(newVotingTime.toString());
    // const signature = signer.signMessage(ethers.utils.arrayify(trh));
    // console.log(signature);

    // const tx = {
    //     to: ariadne.address,
    //     data: ariadne.interface.encodeFunctionData('executeTransaction', [nonce, ariadne.address, value, data, signatures]),
    //     gasLimit: customGasLimit,
    //   };
      
    //   const txHash = await alchemyProvider.sendTransaction(tx);
    //   const receipt = await alchemyProvider.getTransaction(txHash);
    //   const code = await alchemyProvider.call(receipt);
    //   console.log('Transaction code:', code);
      
    //   const reason = ethers.utils.toUtf8String('0x' + code.substr(138));
    //   console.log('Revert reason:', reason);

      
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});