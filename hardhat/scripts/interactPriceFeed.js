const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/amm/PriceFeed.sol/PriceFeed.json");
const caller = require("../artifacts/contracts/amm/CallerContract.sol/CallerContract.json");
const { WrapperBuilder } = require("@redstone-finance/evm-connector");
require('dotenv').config({path:__dirname+'/.env'})
const sdk = require("redstone-sdk");

async function main() {
    const contractAddress = '0xf74171ce01Aa0895E812cCE26f2F81Fd50ad516f';
    const callerAddress ='0x47614bad57c34B5CD589B0304AA51BBbD53528E4'; // add address here
    const payloadAddress = '0x9Ce08527F61257aCA016E323BE45B66aE561E8DA'; // add address here

  // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// Signer
const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
  const priceFeed = new ethers.Contract( contractAddress,contract.abi, signer);
  const pfCon = await priceFeed.connect(signer);

  const wrappedContract = WrapperBuilder.wrap(pfCon).usingDataService({
    dataServiceId: "redstone-stocks-demo",
    uniqueSignersCount: 1,
    dataFeeds: ["TSLA","META","GOOG"],
  }, ["https://d33trozg86ya9x.cloudfront.net"]);

  const tesla = ethers.utils.formatBytes32String("TSLA");
  const meta = ethers.utils.formatBytes32String("META");
  const goog = ethers.utils.formatBytes32String("GOOG");
  // Call a function in the contract
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
  // console.log('payload',redstonePayload);
  const result = await wrappedContract.getStockPrice(tesla);
  console.log("Function result:", result);

  const callee = new ethers.Contract( callerAddress,caller.abi, signer);
  const callerCon =  callee.connect(signer);


  const callerRes = await callerCon.getPriceValue(payloadAddress,tesla,`0x${redstonePayload}`);
  console.log('callerRes: ',callerRes.toString());
}
//6.2984


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
