import { StaticImageData } from "next/image";

export type Stock = {
    name: string;
    symbol: string;
    img: StaticImageData;
    slug: number;
    address: string;
    poolAddress: string;
}

export type Trade = {
    tradeId: string;
    traderAddress: string;
    asset: string;
    side: number;
    positionSize: number;
    entryPrice: number;
    entryDate: string;
    leverage: number;
    lastInterest: number;
    interestAccrued: number;
    startCollateral: number;
    currentCollateral: number;
    openValue: number;
    cummulativeFFR: number;
}   



export type Pool = {
    poolAddress: string;
    mmr: number;
    ffr: number;
    lastFFR: number;
    nextFFR: number;
    interestPeriod: number;
    interest: number;
    stakers: number;
    rewardPeriod: number;
    totalRewards: number;
    lastRewardBlock: number;
    nextRewardBlock: number;
    poolTokens: number;
    minimumStake: number;
    totalStaked: number;
    usdcInVault: number;
    usdcOnLoan: number;
}