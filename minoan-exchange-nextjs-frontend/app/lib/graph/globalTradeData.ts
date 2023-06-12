import request, { gql } from "graphql-request";
import { cache } from 'react'

export const getGlobalTradeData = cache(async function fetchGlobalTradeData() {
    const query = gql` 
      query getTrades {
    trades {
      id
      created
      user{
        id
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
        }
        priceData {
          marketPrice
          indexPrice
        }
        snapshots {
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

    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    // const variables = {};
    const data = await request(endpoint, query);

    return data;
});