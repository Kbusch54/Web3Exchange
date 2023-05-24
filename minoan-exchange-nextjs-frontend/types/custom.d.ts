import { StaticImageData } from "next/image";
import { Address } from "wagmi";

export type Stock = {
    name: string;
    symbol: string;
    img: StaticImageData;
    slug: number;
    address: string;
    poolAddress: string;
}

export type User = {
    id: string
    address: Address
    balances: Balance
    stakes: Stake[]
    trades: Trade[]
  }
export type Trade = {
    id:string
    tradeId: string
    user: User
    ammPool: LoanPool 
    vamm: VAmm
    tradeBalance: TradeBalance
    created: number
    startingCost: number
    isActive: Boolean
    liquidated: Boolean
}   
export type TradeBalance ={
    id:string
    tradeId: string
    LastInterestPayed: number
    LastFFRPayed: number
    interestRate: number
    side: number
    collateral: number
    leverage: number
    loanAmt: number
    positionSize: number
    entryPrice: number
    exitPrice: number
    exitTime: number
    pnl: number
  }


  export type LoanPool = {
    id:string
    amm: VAmm
    ariadneDAO: AriadneDAO
    created: number
    minLoan: number
    maxLoan: number
    interestRate: number
    interestPeriod: number
    mmr: number
    minHoldingsReqPercentage: number
    tradingFee: number
    poolBalance: PoolBalance
    trades: Trade[]
    debt: Debt
    poolToken: PoolToken
    loanPoolTheseus: LoanPoolTheseus
    stakes: Stake[]
  }
  export type PoolBalance = {
    id:string
    amm:  VAmm
    totalUsdcSupply: number
    availableUsdc: number
    outstandingLoanUsdc: number
    loanPool: LoanPool 
  }
  export type TheseusDAO = {
    id:string
    proposals: Proposal[]
    poolTokens: PoolToken[]
    currentId: number
    votingTime: number
    maxVotingPower: number
    minVotingPower: number
    tokenId: number
    votesNeededPercentage: number
    insuranceFundMin: number
    loanPoolTheseus: LoanPoolTheseus
    balances: Balance[]
    stakes: Stake[]
  }

   export type LoanPoolTheseus = {
    id:string
    minMMR: number
    maxMMR: number
    minInterestRate: number
    maxInterestRate: number
    minTradingFee: number
    maxTradingFee: number
    minLoan: number
    maxLoan: number
    minHoldingsReqPercentage: number
    maxHoldingsReqPercentage: number
    minInterestPeriod: number
    maxInterestPeriod: number
    theseusDAO: TheseusDAO
  }
   export type AriadneDAO = {
    id:string
    currentId: number
    ammPool: VAmm
    votingTime: number
    maxVotingPower: number
    minVotingPower: number
    votesNeededPercentage: number
    tokenId: number
    poolToken: PoolToken
    proposals: Proposal[]
  }
   export type Proposal = {
    id:string
    dAO: AriadneDAO
    nonce: number
    theseusDAO: TheseusDAO
    proposer: Address
    to: Address
    value: number
    data: string
    result: string
    executor: Address
    proposedAt: number
    transactionHash: string
    isPassed: Boolean
  }
  
   export type Stake = {
    id:string
    user: User
    totalStaked: number
    tokensOwnedbByUser: number
    ammPool: LoanPool
    theseusDAO: TheseusDAO
    token: PoolToken
  }
   export type PoolToken = {
    id:string
    tokenId: number
    totalSupply: number
    tokenBalance: Stake[]
    ammPool: LoanPool
    isFrozen: Boolean
  }
  
  
   export type VAmm = {
    id:string
    loanPool: LoanPool
    ffrs: FFR[]
    currentIndex: number
    totalPositionSize: number
    isFrozen: Boolean
    name: string
    symbol: string
    payload: string
    snapshots: Snapshot[]
    priceData: PriceData[]
  }
   export type Snapshot = {
    id:string
    index: number
    vamm: VAmm
    blockTimestamp: number
    marketPrice: BigInt
    quoteAssetReserve: number
    baseAssetReserve: number
    indexPrice: number
    ffr: number
    totalPositionSize: BigInt
  }
  
   export type FFR = {
    id:string
    timeStamp: number
    vAmm: VAmm
    ffr: number
    index: number
  }
   export type PriceData = {
    id:string
    timeStamp: number
    vAmm: VAmm
    marketPrice: BigInt 
    indexPrice: number
  }
  
   export type Balance = {
    id:string
    user: User
    availableUsdc: number
    totalCollateralUsdc: number
  }
  
  
  
   export type Debt = {
    id:string
    amountOwed: number
    loanPool: LoanPool
  }