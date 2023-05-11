const { WrapperBuilder } = require("@redstone-finance/evm-connector");
const { formatBytes32String } = require("ethers/lib/utils");

describe("StocksExample", function () {
  let contract;

  beforeEach(async () => {
    // Deploy contract
    const StocksExample = await ethers.getContractFactory("FakeOracle");
    //get signers
    const [owner, addr1, addr2] = await ethers.getSigners();
    contract = await StocksExample.deploy();
  });

  it("Get TSLA price securely", async function () {
    // Wrapping the contract
    const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
      dataServiceId: "redstone-stocks-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","META"],
    }, ["https://d33trozg86ya9x.cloudfront.net"]);

    // Interact with the contract (getting oracle value securely)
    const inputTSLA = formatBytes32String("TSLA");
    const tslaPriceFromContract = await wrappedContract.getStockPrice(inputTSLA);
    console.log({ tslaPriceFromContract });
    
    // const googPriceFromContract = await wrappedContract.getLatestGoogPrice();
    // console.log({ googPriceFromContract });

    const inputMETA = formatBytes32String("META");
    const metaPriceFromContract = await wrappedContract.getStockPrice(inputMETA);
    console.log({ metaPriceFromContract });

    // make to bytes32
    
    // const input = formatBytes32String("META");
    // console.log('input META: ',input );

    // const withInoput = await wrappedContract.getStockPrice(input);
    // console.log({ withInoput });
});
});