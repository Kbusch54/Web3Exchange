// testing for depositing fake usdc and staking it
const { expect,chai } = require("chai");

const { ethers } = require("ethers");
const hre = require("hardhat");
const { loadFixture,mine,takeSnapshot } = require("@nomicfoundation/hardhat-network-helpers");
const {utils} = require("ethers/lib");
const {
  formatEther,
  parseEther,
  parseUnits,
  formatUnits
} = require("ethers/lib/utils");
describe("depositAndStake", function () {
    async function deployContracts() {
        const [owner, otherAccount, amm] = await hre.ethers.getSigners();
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
        
        const PoolTokens = await hre.ethers.getContractFactory("PoolTokens");
        const loanToks = await PoolTokens.deploy(owner.address);
        const Staking = await hre.ethers.getContractFactory("Staking");
        await loanToks.deployed();
        const staking = await Staking.deploy(usdc.address, loanToks.address);
        await staking.deployed();
        const stakeAdd = staking.address;
        await loanToks.setStaking(stakeAdd);
        return {usdc, owner, otherAccount, amm,loanToks,staking};
};
    it("should deposit and show balance", async function () {
        
        const {usdc, owner, otherAccount, amm,loanToks,staking} = await loadFixture(deployContracts);
        await usdc.approve(staking.address, parseUnits("100", 6));
        await staking.deposit(parseUnits("100", 6));
        const balance = await staking.callStatic.availableBalance(owner.address);
        expect(balance).to.equal(parseUnits("100", 6));
    });
    it("should deposit and stake", async function () {
            
            const {usdc, owner, otherAccount, amm,loanToks,staking} = await loadFixture(deployContracts);
            await usdc.approve(staking.address, parseUnits("100", 6));
            await staking.deposit(parseUnits("100", 6));
            await staking.stake(parseUnits("100", 6),amm.address);
            const usdcAvaillable = await staking.callStatic.availableBalance(owner.address);
            expect(usdcAvaillable).to.equal(parseUnits("0", 6));
            const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,0);
            console.log(loanToksBalance.toString());

            // mapping(address=>uint)public poolTotalUsdcSupply;
            // mapping(address=>uint)public poolAvailableUsdc;

            const poolTotalUsdcSupply = await staking.callStatic.poolTotalUsdcSupply(amm.address);
            console.log('total usdc supply on pool',poolTotalUsdcSupply.toString());
            const poolAvailableUsdc = await staking.callStatic.poolAvailableUsdc(amm.address);
            console.log('total usdc available on pool',poolAvailableUsdc.toString());

            expect(poolAvailableUsdc).to.equal(parseUnits("100", 6));
            expect(poolTotalUsdcSupply).to.equal(parseUnits("100", 6));

        });

    it("should deposit and stake and unstake", async function () {
                
                const {usdc, owner, otherAccount, amm,loanToks,staking} = await loadFixture(deployContracts);
                await usdc.approve(staking.address, parseUnits("100", 6));
                await staking.deposit(parseUnits("100", 6));
                await staking.stake(parseUnits("100", 6),amm.address);
                const tokBal = await loanToks.callStatic.balanceOf(owner.address,0);
                console.log('tokBal',tokBal.toString());
                await staking.unStake(tokBal,amm.address);
                const usdcAvaillable = await staking.callStatic.availableBalance(owner.address);
                console.log('usdcAvaillable',usdcAvaillable.toString());
                expect(usdcAvaillable).to.equal(parseUnits("100", 6));
                const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,0);
                console.log(loanToksBalance.toString());
    
                // mapping(address=>uint)public poolTotalUsdcSupply;
                // mapping(address=>uint)public poolAvailableUsdc;
    
                const poolTotalUsdcSupply = await staking.callStatic.poolTotalUsdcSupply(amm.address);
                console.log('total usdc supply on pool',poolTotalUsdcSupply.toString());
                const poolAvailableUsdc = await staking.callStatic.poolAvailableUsdc(amm.address);
                console.log('total usdc available on pool',poolAvailableUsdc.toString());
    
                expect(poolAvailableUsdc).to.equal(parseUnits("0", 6));
                expect(poolTotalUsdcSupply).to.equal(parseUnits("0", 6));
    
            });
    it("should deposit and stake and unstake and withdraw", async function () {
                    
                    const {usdc, owner, otherAccount, amm,loanToks,staking} = await loadFixture(deployContracts);
                    await usdc.approve(staking.address, parseUnits("100", 6));
                    await staking.deposit(parseUnits("100", 6));
                    await staking.stake(parseUnits("100", 6),amm.address);
                    const tokBal = await loanToks.callStatic.balanceOf(owner.address,0);
                    console.log('tokBal',tokBal.toString());
                    await staking.unStake(tokBal,amm.address);
                    const usdcAvaillable = await staking.callStatic.availableBalance(owner.address);
                    expect(usdcAvaillable).to.equal(parseUnits("100", 6));

                    const usdcBalBefore = await usdc.balanceOf(owner.address);
                    await staking.withdraw(parseUnits("100", 6));
                    console.log('usdcAvaillable',usdcAvaillable.toString());
                    const loanToksBalance = await loanToks.callStatic.balanceOf(owner.address,0);
                    console.log(loanToksBalance.toString());
                    const usdcBalAfter = await usdc.balanceOf(owner.address);
        
                    // mapping(address=>uint)public poolTotalUsdcSupply;
                    // mapping(address=>uint)public poolAvailableUsdc;
        
                    const poolTotalUsdcSupply = await staking.callStatic.poolTotalUsdcSupply(amm.address);
                    console.log('total usdc supply on pool',poolTotalUsdcSupply.toString());
                    const poolAvailableUsdc = await staking.callStatic.poolAvailableUsdc(amm.address);
                    console.log('total usdc available on pool',poolAvailableUsdc.toString());
        
                    expect(poolAvailableUsdc).to.equal(parseUnits("0", 6));
                    expect(poolTotalUsdcSupply).to.equal(parseUnits("0", 6));
                    expect(usdcBalAfter).to.equal(usdcBalBefore.add(parseUnits("100", 6)));
        
                });
});
 