import request, { gql } from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { cache } from 'react'



// export { getGlobalTradeData as GET };
 async function fetchGlobalTradeData() {
    const query = gql` 
      query getTrades {
    trades(orderBy: created, orderDirection: desc) {
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

    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    // const variables = {};
    const data = await request(endpoint, query);

    return data;
};

export async function GET(req: Request){
    console.log('req', req)
    try {
      const data = await fetchGlobalTradeData();
    //   @ts-ignore
      return NextResponse.json(data.trades);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' })
    }
  }
  