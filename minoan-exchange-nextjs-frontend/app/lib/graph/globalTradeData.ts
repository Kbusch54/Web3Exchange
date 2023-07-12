import request, { gql } from "graphql-request";
import { cache } from 'react'

export const revalidate = 50000 // 500 seconds
export const getGlobalTradeData = cache(async function fetchGlobalTradeData() {
    const query = gql` 
      query getTrades {
    trades(orderBy: created, orderDirection: asc) {
      id
      created
      user{
        id
      }
      ammPool{
        id
      }
      tradeOpenValues{
        openValue
        openLoanAmt
        openCollateral
        openLeverage
        openEntryPrice
        openPositionSize
        openInterestRate  
        tradingFee
  }
  collateralChange{
    collateralChange
  }
  liquidityChange{
    collateralChange
  }
      tradeBalance {
        side
        positionSize
        leverage
        pnl
        interestRate
        LastFFRPayed
        collateral
        LastInterestPayed
        LastFFRPayed
        LastInterestPayed
        tradeId {
          tradeId
        }
        loanAmt
        positionSize
        leverage
        entryPrice
        exitPrice
        exitTime 
      }
      startingCost
      isActive
      liquidated
      vamm {
        id
        symbol
        loanPool {
          maxLoan
          minLoan
          mmr
          interestPeriod
          tradingFee
        }
        priceData(orderBy: timeStamp, orderDirection: desc) {
          marketPrice
          indexPrice
        }
        snapshots(orderDirection: desc, orderBy: index) {
          quoteAssetReserve
          baseAssetReserve
          marketPrice
          ffr
          indexPrice
        }
      }
    }
      }
`;

// (orderBy: created orderDirection: desc)

    const endpoint =process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    // const variables = {};
    const data = await request(endpoint, query);

    return data;
});