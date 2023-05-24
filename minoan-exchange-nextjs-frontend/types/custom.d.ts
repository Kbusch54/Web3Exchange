import { StaticImageData } from "next/image";
import { Address } from "wagmi";

export type Stock = {
    name: String;
    symbol: String;
    img: StaticImageData;
    slug: Number;
    address: String;
    poolAddress: String;
}

export type User = {
    id: String
    address: Address
    balances: Balance
    stakes: Stake[]
    trades: Trade[]
  }
export type Trade = {
    id:String
    tradeId: String
    user: User
    ammPool: LoanPool 
    vamm: VAmm
    tradeBalance: TradeBalance
    created: Number
    startingCost: Number
    isActive: Boolean
    liquidated: Boolean
}   
export type TradeBalance ={
    id:String
    tradeId: String
    LastInterestPayed: Number
    LastFFRPayed: Number
    interestRate: Number
    side: Number
    collateral: Number
    leverage: Number
    loanAmt: Number
    positionSize: Number
    entryPrice: Number
    exitPrice: Number
    exitTime: Number
    pnl: Number
  }


  export type LoanPool = {
    id:String
    amm: VAmm
    ariadneDAO: AriadneDAO
    created: Number
    minLoan: Number
    maxLoan: Number
    interestRate: Number
    interestPeriod: Number
    mmr: Number
    minHoldingsReqPercentage: Number
    tradingFee: Number
    poolBalance: PoolBalance
    trades: Trade[]
    debt: Debt
    poolToken: PoolToken
    loanPoolTheseus: LoanPoolTheseus
    stakes: Stake[]
  }
  export type PoolBalance = {
    id:String
    amm:  VAmm
    totalUsdcSupply: Number
    availableUsdc: Number
    outstandingLoanUsdc: Number
    loanPool: LoanPool 
  }
  export type TheseusDAO = {
    id:String
    proposals: Proposal[]
    poolTokens: PoolToken[]
    currentId: Number
    votingTime: Number
    maxVotingPower: Number
    minVotingPower: Number
    tokenId: Number
    votesNeededPercentage: Number
    insuranceFundMin: Number
    loanPoolTheseus: LoanPoolTheseus
    balances: Balance[]
    stakes: Stake[]
  }

   export type LoanPoolTheseus = {
    id:String
    minMMR: Number
    maxMMR: Number
    minInterestRate: Number
    maxInterestRate: Number
    minTradingFee: Number
    maxTradingFee: Number
    minLoan: Number
    maxLoan: Number
    minHoldingsReqPercentage: Number
    maxHoldingsReqPercentage: Number
    minInterestPeriod: Number
    maxInterestPeriod: Number
    theseusDAO: TheseusDAO
  }
   export type AriadneDAO = {
    id:String
    currentId: Number
    ammPool: VAmm
    votingTime: Number
    maxVotingPower: Number
    minVotingPower: Number
    votesNeededPercentage: Number
    tokenId: Number
    poolToken: PoolToken
    proposals: Proposal[]
  }
   export type Proposal = {
    id:String
    dAO: AriadneDAO
    nonce: Number
    theseusDAO: TheseusDAO
    proposer: Address
    to: Address
    value: Number
    data: String
    result: String
    executor: Address
    proposedAt: Number
    transactionHash: String
    isPassed: Boolean
  }
  
   export type Stake = {
    id:String
    user: User
    totalStaked: Number
    tokensOwnedbByUser: Number
    ammPool: LoanPool
    theseusDAO: TheseusDAO
    token: PoolToken
  }
   export type PoolToken = {
    id:String
    tokenId: Number
    totalSupply: Number
    tokenBalance: Stake[]
    ammPool: LoanPool
    isFrozen: Boolean
  }
  
  
   export type VAmm = {
    id:String
    loanPool: LoanPool
    ffrs: FFR[]
    currentIndex: Number
    totalPositionSize: Number
    isFrozen: Boolean
    name: String
    symbol: String
    payload: String
    snapshots: Snapshot[]
    priceData: PriceData[]
  }
   export type Snapshot = {
    id:String
    index: Number
    vamm: VAmm
    blockTimestamp: Number
    marketPrice: BigInt
    quoteAssetReserve: Number
    baseAssetReserve: Number
    indexPrice: Number
    ffr: Number
    totalPositionSize: BigInt
  }
  
   export type FFR = {
    id:String
    timeStamp: Number
    vAmm: VAmm
    ffr: Number
    index: Number
  }
   export type PriceData = {
    id:String
    timeStamp: Number
    vAmm: VAmm
    marketPrice: BigInt 
    indexPrice: Number
  }
  
   export type Balance = {
    id:String
    user: User
    availableUsdc: Number
    totalCollateralUsdc: Number
  }
  
  
  
   export type Debt = {
    id:String
    amountOwed: Number
    loanPool: LoanPool
  }