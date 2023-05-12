const { WrapperBuilder } = require("@redstone-finance/evm-connector");
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");
//   "@openzeppelin/contracts": "^4.8.3",
// "@redstone-finance/evm-connector": "^0.0.18",
describe("StocksExample", function () {
  let contract;

  beforeEach(async () => {
    // Deploy contract
    const StocksExample = await ethers.getContractFactory("PriceFeed");
    //get signers
    const [owner, addr1, addr2] = await ethers.getSigners();
    contract = await StocksExample.deploy();
  });

  it("Get TSLA price securely", async function () {
    // Wrapping the contract
    const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
      dataServiceId: "redstone-stocks-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","META","GOOG"],
    }, ["https://d33trozg86ya9x.cloudfront.net"]);

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

    const redstonePayload2 = await sdk.requestRedstonePayload(
      {
        dataServiceId: "redstone-stocks-demo",
        uniqueSignersCount: 1,
        dataFeeds: ["TSLA"],
      },
      ["https://d33trozg86ya9x.cloudfront.net"],
      unsignedMetadata
    );

    console.log('payload1: ',{ redstonePayload });
    console.log('payload2: ',{ redstonePayload2 });

    // Interact with the contract (getting oracle value securely)
    const inputTSLA = formatBytes32String("TSLA");
    console.log( 'input tesla',inputTSLA );
    const tslaPriceFromContract = await wrappedContract.getStockPrice(inputTSLA);
    console.log({ tslaPriceFromContract });
    
    // const googPriceFromContract = await wrappedContract.getLatestGoogPrice();
    // console.log({ googPriceFromContract });

    const inputMETA = formatBytes32String("META");
    console.log('input META: ',inputMETA );
    const metaPriceFromContract = await wrappedContract.getStockPrice(inputMETA);
    console.log({ metaPriceFromContract });

    // make to bytes32
    
    const input = formatBytes32String("GOOG");
    console.log('input Google: ',input );

    const googlePriceFromContract = await wrappedContract.getStockPrice(input);
    console.log({ googlePriceFromContract });
});
});

// '54534c410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e77e8390018810cc3b4000000020000001d19dc352cd31996b3ecaea7b928fa0ac81301a55f3bc60d7985ffb384267a8de11aa9ebee1ea3cabf5cb4d0d33cb3e9a3e16fec63a98b951a111772831f99c2a1b4d45544100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056a77c4a4018810cc3b40000000200000012fb30148d9b595f88635ca96d90f6064ebf616f528e6891916b9512c7997db8461cc22912ae7605f7ff3237418af2750e1238310ca76d0f67bb29bddc2bec5321b474f4f470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bd9b34c0018810cc3b40000000200000015b3b8c825c235b94ebd8d9c559dd6b0d2c8b85a01c82cce0a5f4388c26242c58512fdee02ee5dee28752a30f17ea159f8663bd6693d08c38d7f02a7f14cec99a1c00036d616e75616c2d7061796c6f616400000e000002ed57011e0000'