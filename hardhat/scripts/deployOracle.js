// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { formatBytes32String } = require("ethers/lib/utils");
const sdk = require("redstone-sdk");

async function main() {
  const Payload = await hre.ethers.getContractFactory("Payload");
  const payload = await Payload.deploy();
  await payload.deployed();
  console.log(
    `Payload deployed to ${payload.address}`
  );

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

  const AmmViewer = await hre.ethers.getContractFactory("AmmViewer");
  const ammViewer = await AmmViewer.deploy();

  await ammViewer.deployed();
  console.log(
    `ammViewer deployed to ${ammViewer.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
