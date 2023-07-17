import request, { gql } from "graphql-request";
import { cache } from 'react'

export const fetchLoanPoolData = cache(async(symbol: string, user: string) => {
    const query = gql` 
      query getLoanPool($id: String!,$user: String!) {
        vamms(where: { symbol: $id}) {
          name
          priceData(orderBy: timeStamp, orderDirection: asc) {
              marketPrice
              isFrozen
              timeStamp
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
              ammPool{
                ariadneDAO{
                  id
                  votesNeededPercentage
                  votingTime
                  poolToken{
                  totalSupply
                  tokenBalance(where:{user:$user}) {
                      tokensOwnedbByUser
                      }
                  }
                }
              }
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
            loanPoolTheseus{
              minMMR
              maxMMR
              minInterestRate
              maxInterestRate
              minTradingFee
              maxInterestPeriod
              minInterestPeriod
              minHoldingsReqPercentage
              maxHoldingsReqPercentage
              maxTradingFee
              minLoan
              maxLoan
            }
          }
        }
        users(where:{id:$user}){
          id
          balances{
            availableUsdc
          }
        }
        trades {
          id
          created
          vamm{
            loanPool{
              interestPeriod
            }
          }
          user{
            id
          }
          ammPool{
            id
          }
          tradeOpenValues{
            openCollateral
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
            exitTime
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
        }
        proposals{
          passedAt
          proposedAt
          proposer
          executor
          dAO{
            id
            votingTime
            ammPool{
              id 
            }
          }
          theseusDAO{
            id
            votingTime
          }
        }
      }
    `;
  
  
  
    const endpoint = process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { id: symbol, user: user };
    const data = await request(endpoint, query, variables);
  
    return data;
  });