// testing for depositing fake usdc and staking it
const { expect,chai } = require("chai");

const { ethers } = require("ethers");
const hre = require("hardhat");
const {
    loadFixture,
    mine,
    takeSnapshot,
    time,
  } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
describe("depositAndStake", function () {
  async function deployContracts() {
    const [owner, otherAccount, third, theseusDao] =
      await hre.ethers.getSigners();
    const FakeCurrency = await hre.ethers.getContractFactory("FakeUsdc");
    const name = "Fake USDC";
    const decimals = 6;
    const symbol = "USDC";
    const usdc = await FakeCurrency.deploy(
      100000000000,
      name,
      symbol,
      decimals
    );
    const FakeOracle = await hre.ethers.getContractFactory("FakeOracle");
    const indexPrice = parseUnits("370", 6);
    const oracle = await FakeOracle.deploy(indexPrice);

    const path = "TSLA";
    const quoteAsset = parseUnits("100", 2);
    const indexPricePeriod =  time.duration.hours(2);
    console.log("indexPricePeriod", indexPricePeriod);

    const PoolTokens = await hre.ethers.getContractFactory("PoolTokens");
    const loanToks = await PoolTokens.deploy(owner.address);
    await loanToks.deployed();
    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(theseusDao.address);

    const Exchange = await hre.ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy(
      usdc.address,
      staking.address,
      theseusDao.address
    );
    const stakeAdd = staking.address;
    console.log("stakeAdd", stakeAdd);
    const exStakingAdd = await exchange.callStatic.staking();
    console.log("exStakingAdd", exStakingAdd);
    console.log("loanpool tokens contract address", loanToks.address);
    console.log('exhcnage address', exchange.address);
    
    await loanToks.setStaking(staking.address);
    await staking.setExchange(exchange.address);
    await staking.setPoolToken(loanToks.address);
    const VAmm = await hre.ethers.getContractFactory("VAmm");
    const amm = await VAmm.deploy(oracle.address);
    await amm.init(
      path,
      indexPrice,
      quoteAsset,
      indexPricePeriod,
      exchange.address
    );
    const LoanPool = await hre.ethers.getContractFactory("LoanPool");
    const loanPool = await LoanPool.deploy(exchange.address);
    const theseusDaoID = await staking.callStatic.ammPoolToTokenId(theseusDao.address);
    console.log('theseusDaoID', theseusDaoID);
    console.log('ex add loanPool', await loanPool.callStatic.exchange());
    await exchange.addAmm(amm.address);
    await exchange.connect(theseusDao).registerLoanPool(loanPool.address);
    await loanPool.initializeVamm(amm.address);
    const PoolTokenAMmID = await staking.callStatic.ammPoolToTokenId(amm.address);


    console.log('PoolTokenAMmID', PoolTokenAMmID);

  

    const ExchangeViewer = await hre.ethers.getContractFactory("ExchangeViewer");
    const exchangeViewer = await ExchangeViewer.deploy(loanPool.address, usdc.address, staking.address, theseusDao.address, exchange.address, amm.address);
    await exchange.setExchangeViewer(exchangeViewer.address);
    console.log("Ready to go here");

    return {
      usdc,
      owner,
      otherAccount,
      amm,
      oracle,
      loanToks,
      exchange,
      staking,
      loanPool,
      theseusDao,
      exchangeViewer
    };
  }
    it("should deposit and show balance", async function () {
        
        const {usdc, owner, otherAccount, amm,loanToks,staking,exchange} = await loadFixture(deployContracts);
        await usdc.approve(exchange.address, parseUnits("100", 6));
        await exchange.deposit(parseUnits("100", 6));
        const balance = await exchange.callStatic.availableBalance(owner.address);
        expect(balance).to.equal(parseUnits("100", 6));
    });
    it("should deposit and stake", async function () {
            
            const {usdc, owner, otherAccount, amm,loanToks,staking,exchange} = await loadFixture(deployContracts);
            await usdc.approve(exchange.address, parseUnits("100", 6));
            await exchange.deposit(parseUnits("100", 6));
            
            await staking.stake(parseUnits("100", 6),amm.address);
            const usdcAvaillable = await exchange.callStatic.availableBalance(owner.address);
            expect(usdcAvaillable).to.equal(parseUnits("0", 6));
            const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,1);
            console.log(loanToksBalance.toString());

            // mapping(address=>uint)public poolTotalUsdcSupply;
            // mapping(address=>uint)public poolAvailableUsdc;

            const poolTotalUsdcSupply = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
            console.log('total usdc supply on pool',poolTotalUsdcSupply.toString());
            const poolAvailableUsdc = await exchange.callStatic.poolAvailableUsdc(amm.address);
            console.log('total usdc available on pool',poolAvailableUsdc.toString());

            expect(poolAvailableUsdc).to.equal(parseUnits("100", 6));
            expect(poolTotalUsdcSupply).to.equal(parseUnits("100", 6));

        });

    it("should deposit and stake and unstake", async function () {
                
                const {usdc, owner, otherAccount, amm,loanToks,staking,exchange} = await loadFixture(deployContracts);
                await usdc.approve(exchange.address, parseUnits("100", 6));
                await exchange.deposit(parseUnits("100", 6));
                
                await staking.stake(parseUnits("100", 6),amm.address);
                const tokBal = await loanToks.callStatic.balanceOf(owner.address,1);
                console.log('tokBal',tokBal.toString());
                await staking.unStake(tokBal,amm.address);
                const usdcAvaillable = await exchange.callStatic.availableBalance(owner.address);
                console.log('usdcAvaillable',usdcAvaillable.toString());
                expect(usdcAvaillable).to.equal(parseUnits("100", 6));
                const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,1);
                console.log(loanToksBalance.toString());
    
                // mapping(address=>uint)public poolTotalUsdcSupply;
                // mapping(address=>uint)public poolAvailableUsdc;
    
                const poolTotalUsdcSupply = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
                console.log('total usdc supply on pool',poolTotalUsdcSupply.toString());
                const poolAvailableUsdc = await exchange.callStatic.poolAvailableUsdc(amm.address);
                console.log('total usdc available on pool',poolAvailableUsdc.toString());
    
                expect(poolAvailableUsdc).to.equal(parseUnits("0", 6));
                expect(poolTotalUsdcSupply).to.equal(parseUnits("0", 6));
    
            });
    it("should deposit and stake and unstake and withdraw", async function () {
                    
                    const {usdc, owner, otherAccount, amm,loanToks,staking,exchange} = await loadFixture(deployContracts);
                    await usdc.approve(exchange.address, parseUnits("100", 6));
                    await exchange.deposit(parseUnits("100", 6));
                    await staking.stake(parseUnits("100", 6),amm.address);
                    const tokBal = await loanToks.callStatic.balanceOf(owner.address,1);
                    console.log('tokBal ',formatUnits(tokBal,8));
                    await staking.unStake(tokBal,amm.address);
                    const usdcAvaillable = await exchange.callStatic.availableBalance(owner.address);
                    expect(usdcAvaillable).to.equal(parseUnits("100", 6));

                    const usdcBalBefore = await usdc.balanceOf(owner.address);
                    await exchange.withdraw(parseUnits("100", 6));
                    console.log('usdcAvaillable $',formatUnits(usdcAvaillable,6));
                    const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,0);
                    console.log('token balance',formatUnits(loanToksBalance,8));
                    const usdcBalAfter = await usdc.balanceOf(owner.address);
                    const poolTotalUsdcSupply = await exchange.callStatic.poolTotalUsdcSupply(amm.address);
                    console.log('total usdc supply on pool $',formatUnits(poolTotalUsdcSupply,6));
                    const poolAvailableUsdc = await exchange.callStatic.poolAvailableUsdc(amm.address);
                    console.log('total usdc available on pool $',formatUnits(poolAvailableUsdc,6));
        
                    expect(poolAvailableUsdc).to.equal(parseUnits("0", 6));
                    expect(poolTotalUsdcSupply).to.equal(parseUnits("0", 6));
                    expect(usdcBalAfter).to.equal(usdcBalBefore.add(parseUnits("100", 6)));
        
                });
    it('shouldnt allow unstake when frozen', async function () {
                        
                    const {usdc, owner, otherAccount, amm,loanToks,staking,exchange} = await loadFixture(deployContracts);
                    await usdc.approve(exchange.address, parseUnits("100", 6));
                    await exchange.deposit(parseUnits("100", 6));
                    await staking.stake(parseUnits("100", 6),amm.address);
                    // call staking.freeze as exchange
                    await exchange.freezeStaking(amm.address);
                    await expect( staking.unStake(parseUnits("100", 6),amm.address)).to.be.revertedWith('Staking: Pool is frozen');
                });
});
 