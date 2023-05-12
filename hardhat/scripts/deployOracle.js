// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  // const Oracle = await hre.ethers.getContractFactory("PriceFeed");
  // const oracle = await Oracle.deploy();

  // await oracle.deployed();
  // console.log(
  //   `Oracle deployed to ${oracle.address}`
  // );
  const Payload = await hre.ethers.getContractFactory("Payload");
  const payload = await Payload.deploy();
  await payload.deployed();
  console.log(
    `Payload deployed to ${payload.address}`
  );
  const Caller = await hre.ethers.getContractFactory("CallerContract");
  const caller = await Caller.deploy();

  await caller.deployed();
  console.log(
    `Caller deployed to ${caller.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
