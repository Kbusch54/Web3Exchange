const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
   
    const ariadne = await hre.ethers.getContractAt("AriadneDAO","0x1637bdDd2E139DeBA037387844c316B05F6B6d4E",signer);

    const signatures = [ "0x41f3ed6178ea12fde9effb8c9b48aa04963e20814810a6ccbf9649fce8760c8074765afd5f729cde9d3445ab5f88ccbab11f6ad5d3f4fa7b0a9f0b16720f0b5b1c"];
    const value='0x0';
    const data ="0xc94891fd8ea53c65459860eb5e2bce37ec1f10686b818adb3d4934eab4bd1d09765a4407eb9383f45870713a1bb67b35776efc0504c869ebc7982eda8b601da01b";
    const nonce = 12;
    // uint _id,
    // address payable to,
    // uint256 value,
    // bytes calldata data,
    // bytes[] calldata signatures
    const customGasLimit = 300000;// Use your existing provider

    const tx = {
        to: ariadne.address,
        data: ariadne.interface.encodeFunctionData('executeTransaction', [nonce, ariadne.address, value, data, signatures]),
        gasLimit: customGasLimit,
      };
      
      const txHash = await alchemyProvider.sendTransaction(tx);
      const receipt = await alchemyProvider.getTransaction(txHash);
      const code = await alchemyProvider.call(receipt);
      console.log('Transaction code:', code);
      
      const reason = ethers.utils.toUtf8String('0x' + code.substr(138));
      console.log('Revert reason:', reason);

      
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});