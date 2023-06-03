const { ethers } = require("hardhat");
require('dotenv').config({path:__dirname+'/.env'})
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");
const {time } = require("@nomicfoundation/hardhat-network-helpers");


async function main() {
    
        // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

    // Signer
    const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
   
    // const ariadne = await hre.ethers.getContractAt("TheseusDAO","0xA547af463d3A202e0E85CA766FB67eE0395e4D5C",signer);
    // const staking = await hre.ethers.getContractAt("Staking","0x0C9dfCBe62a84344fE53B2B39f9dc9906bbdEFC4",signer);

    // // const usdc = await hre.ethers.getContractAt("FakeUsdc","0xAADbde5D0ED979b0a88770be054017fC40Bc43d1",signer);

    // const toStake = ethers.utils.parseUnits("100", 6);
    // await staking.stake(toStake,ariadne.address);


    // const signatures = [ "0x41f3ed6178ea12fde9effb8c9b48aa04963e20814810a6ccbf9649fce8760c8074765afd5f729cde9d3445ab5f88ccbab11f6ad5d3f4fa7b0a9f0b16720f0b5b1c"];
    // const value='0x0';
    // const data ="0xf6890b310000000000000000000000000000000000000000000000000000000000003840";
    // const nonce = 0;
    // // const transactionHash = await ariadne.getTransactionHash(nonce, ariadne.address, value, data);
    // // const trh ='0xa738f8522e6a2e90198d1778182a4d31ae7f1bd3131898c4c5c1cf248d2c5c3d'
    // // console.log(transactionHash);
    // const tx = await ariadne.newProposal( ariadne.address,data);

    const exchange = await hre.ethers.getContractAt("Exchange","0xbf68D4a14c353B9781e5c481413DaEa0d9bD5405",signer);
    const loanPool = await hre.ethers.getContractAt("LoanPool","0xa71Cb4B8850063e8cdddC1438FbFF20d901ef0e5",signer);

    const teslaAmm ='0xd4e3F66E134558Df57cD7Ce2e17758Bf9e041851'

    const minLoan = await loanPool.minLoan(teslaAmm);
    console.log('minLoan $',ethers.utils.formatUnits(minLoan, 6));
    const maxLoan = await loanPool.maxLoan(teslaAmm);
    console.log('maxLoan $',ethers.utils.formatUnits(maxLoan, 6));
    const mmr = await loanPool.mmr(teslaAmm);
    console.log('mmr $',ethers.utils.formatUnits(mmr, 6));
    const tradeCollateral = ethers.utils.parseUnits("250", 6);
    const leverage = 3;
    const side =1;
   
    const gasLimit = ethers.utils.parseUnits("500", 6);

    const loanAmt = tradeCollateral*leverage;

    const Vamm = await hre.ethers.getContractAt("VAmm",teslaAmm,signer);
    const ammViewer = "0xbCeF8b88c81eE970B5BF388C05a2b2419b51dCcC"

    const viewer = await hre.ethers.getContractAt("AmmViewer",ammViewer,signer);

    const isFrozen = await Vamm.isFrozen();
    console.log('isFrozen: ', isFrozen);

    const inputTSLA = formatBytes32String("TSLA");
    console.log('inputTSLA: ', inputTSLA);
    // const teslaPrice = await viewer.getPriceValue(inputTSLA);
    // console.log('teslaPrice: ', teslaPrice.toString());


    const payloadAdd =  "0x842B2B8ECAF0194364E493693f43Ef8fFBdFa761"
    const payload = await hre.ethers.getContractAt("Payload",payloadAdd,signer);
    // //amm viewer
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
  

  // console.log('redstonePayload: ', redstonePayload);
  const payloadFromAmm = await viewer.payload();
  const redStoneP = `0x${redstonePayload}`
  // console.log('payloadFromAmm: ', payloadFromAmm);
const oldPayload = '0x54534c4100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042f4637400188407af52000000020000001142d0fa5bb5bcae9ccdd8315de95ca5cd0c02adb1869345e4f49d6b0b12af67f0f77e166d0262f455cc2fe4348cb57850515ef2d28997b0eb999824f5827eec81b4d4554410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b5d56e600188407af52000000020000001e1d084a7b9e104fc3c42a5bca663ddd3a3317ca9db055372ece7c6793302733c6b81dc74e78f17e359f4998ea5452bc8b8d986b869f2d8fb502d7408487274fa1b474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002debf17c00188407af520000000200000012c27e170601ce776be3a287512765ffecec60fac641ee38ffd906a4ac8f76c764591d24349ba30ef9b2330c4a513c53b5334ba420867f1d4e435c25ad90ba3321b00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
  // console.log('do the equal', payloadFromAmm== redStoneP);
  // console.log('do the equal old to new', payloadFromAmm== oldPayload);
  // console.log('payloadAMm', payloadFromAmm);
  // console.log('redStoneP', redStoneP);
  // console.log('oldPayload', oldPayload);
  const useThisNow = '0x54534c410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004f7c8c8400188823aed8000000020000001e300c9e193f7f701af8f79761e7f314e3d90311a84cc8cfe9a66de18bb27386e657a0e12b14d8e89861ad13ba902c58cc121e288b14fb82ae991f738192784ef1c4d4554410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006580498a00188823aed8000000020000001e4161d3711318e338a391fca3b41906b765efb90d65150d4a9b886f1ca5d064f36f3d63ed512800cec94a43bb44e3b38828fea8da6b0d54d50bd0b9c4f2d1b6e1c474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ea4031100188823aed8000000020000001146b63bb4a5999416f6ec291b1e099a8c8750fcb122c8e42a9395d062f88aecc6634d97854d4381bd11e276f1e125363cd8ace52f5b5b475e1ba4208a52b12a71c00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
  const useThis = '0x54534c410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004f7c8c840018882382e6000000020000001f7e2629b1f9d59e0a6089865d80a5a1584fd28e36be675adacdb1c0b5f1d5c082bf55fe8cd11251b3f3bb509650e0a2080c735365bb8fea14ca42a3e6d5adbbc1c4d4554410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006580498a0018882382e60000000200000010daf5aa8370f8fd1b717e960c6c9c2f9a75363d0bdc496897238bcb95e4f7c1922081a4f713dd911eb2cf86201464c31818979de1ecf0642cad2632d31bd1c3a1c474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002ea403110018882382e60000000200000015d3bc99a79b79e79d16f535794279059fff398521ec860aaf77332e9537092a13949f92423d441335ccb38f61c67ab7195dd2fe2e4875d830733ab232a8cecde1c00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'
  const latestPrice = await payload.getLatestPrice(useThisNow,inputTSLA);
  console.log('latestPrice: $', ethers.utils.formatUnits(latestPrice, 8));
    // getPriceValue

    // const isItAmm = await exchange.availableBalance(signer.address)

    // console.log('availbable abl $',ethers.utils.formatUnits(isItAmm, 6));
  //   try {
  //     const tx = await exchange.openPosition(teslaAmm, tradeCollateral, leverage, side,{gasLimit:gasLimit});
  //     await tx.wait();
  //     console.log('tx: ', tx);
  // } catch (error) {
  //   console.log('error: ', error)
  //     const reasonBytes = error.data;
  //     console.log("Error data:", reasonBytes);
  //     console.log("Error data (decoded):", reasonBytes);
  //     // const errorSelector = ethers.utils.hexDataSlice(reasonBytes, 0, 4);
  //     // console.log("Error selector:", errorSelector);
  // }
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