const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/amm/PriceFeed.sol/PriceFeed.json");
const { WrapperBuilder } = require("@redstone-finance/evm-connector");
require('dotenv').config({path:__dirname+'/.env'})

async function main() {
    const contractAddress = '0xa616Fa2181460b70958E296A6fEb81B5B7072401';

  // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="goerli", process.env.ALCHEMY_API_KEY);

// Signer
const signer = new ethers.Wallet(process.env.GOERLI_PRIVATE_KEY, alchemyProvider);
  const contractFactory = new ethers.Contract( contractAddress,contract.abi, signer);
  const contractInstance = await contractFactory.connect(signer);

  const wrappedContract = WrapperBuilder.wrap(contractInstance).usingDataService({
    dataServiceId: "redstone-stocks-demo",
    uniqueSignersCount: 1,
    dataFeeds: ["TSLA","META","GOOG"],
  }, ["https://d33trozg86ya9x.cloudfront.net"]);

  const tesla = ethers.utils.formatBytes32String("TSLA");
  // Call a function in the contract
  const result = await wrappedContract.getStockPrice(tesla);
  console.log("Function result:", result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
