import request, { gql } from "graphql-request";

export async function fetchLoanPoolData(symbol: string, user: string) {
    const query = gql` 
      query getLoanPool($id: String!,$user: String!) {
        vamms(where: { symbol: $id}) {
          name
          priceData(orderBy: timeStamp, orderDirection: asc) {
            marketPrice
            marketPrice
            isFrozen
            timeStamp
          }
          snapshots(orderDirection: asc, orderBy: index) {
            quoteAssetReserve
            baseAssetReserve
            marketPrice
            blockTimestamp
            ffr
            indexPrice
          }
          loanPool {
            id
            created
            minLoan
            maxLoan
            interestRate
            interestPeriod
            mmr
            minHoldingsReqPercentage
            tradingFee
            poolBalance {
              totalUsdcSupply
              availableUsdc
              outstandingLoanUsdc
            }
            stakes{
              totalStaked
              }
            poolToken{
              tokenId
              totalSupply
              tokenBalance(where:{user:$user}){
                tokensOwnedbByUser
                totalStaked
                user{
                  balances{
                    availableUsdc
                  }
                }
              }
            }
          }
        }
        users(where:{id:$user}){
          id
          balances{
            availableUsdc
          }
        }
      }
     
    `;
  
  
  
    const endpoint = process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { id: symbol, user: user };
    const data = await request(endpoint, query, variables);
    return data;
  }