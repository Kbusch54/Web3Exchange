const { WrapperBuilder } = require("@redstone-finance/evm-connector");
const { formatBytes32String } = require("ethers/lib/utils");

describe("StocksExample", function () {
  let contract;

  beforeEach(async () => {
    // Deploy contract
    const StocksExample = await ethers.getContractFactory("FakeOracle");
    contract = await StocksExample.deploy(1000000);
  });

  it("Get TSLA price securely", async function () {
    // Wrapping the contract
    const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
      dataServiceId: "redstone-stocks-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","GOOG","META"],
    }, ["https://d33trozg86ya9x.cloudfront.net"]);

    // Interact with the contract (getting oracle value securely)
    const tslaPriceFromContract = await wrappedContract.getLatestTslaPrice();
    console.log({ tslaPriceFromContract });
    
    const googPriceFromContract = await wrappedContract.getLatestGoogPrice();
    console.log({ googPriceFromContract });


    const metaPriceFromContract = await wrappedContract.getLatestMetaPrice();
    console.log({ metaPriceFromContract });

    //make to bytes32
    
    const input = formatBytes32String("GOOG");

    const withInoput = await wrappedContract.getStockPrice(input);
    console.log({ withInoput });
});
});