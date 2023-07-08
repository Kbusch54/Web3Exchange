import request, { gql } from "graphql-request";
import { cache } from 'react'


export const getUserData = cache(async function fetchUserData(user: string) {
    const query = gql` 
      query getAllData($user: String!) {

    trades(
    orderBy: created
    orderDirection: asc
    where: { user: $user}
  ) {
      isActive
      id
      created
      user{
        id
      }
      tradeOpenValues{
        tradingFee
        openCollateral
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
        exitTime
        tradeId {
          tradeId
        }
        loanAmt
        positionSize
        leverage
        entryPrice
      }
      ammPool{
        id
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
    users(where:{id:$user}){
      balances{
        availableUsdc
        totalCollateralUsdc
      }
      stakes(where:{user:$user}){
        theseusDAO{
          tokenId
          poolToken{
                totalSupply
            tokenBalance{
              tokensOwnedbByUser
              totalStaked
            }
          }
        }
        ammPool{
            id
          poolToken{
            tokenId
            totalSupply
          }
          poolBalance{
            totalUsdcSupply
          }
        }
        totalStaked
        tokensOwnedbByUser
      }
    }
  
  }
`;
    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { user: user };
    const data = await request(endpoint, query, variables);

    return data;
});