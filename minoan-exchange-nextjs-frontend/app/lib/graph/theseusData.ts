import request, { gql } from "graphql-request";
import { cache } from 'react'

export const fetchTheseus = cache(async function fetchData(user: string, theseusAdd: string) {
    const query = gql` 
      query getvamm($user: String!, $theseusAdd: String!) {
       
        theseusDAOs{
          id
          currentId
          votingTime
          maxVotingPower
          minVotingPower
          tokenId
          votesNeededPercentage
          insuranceFundMin
          poolToken{
            tokenId
            totalSupply
            tokenBalance(where:{user:$user}){
                tokensOwnedbByUser
                totalStaked
              }
  
          }
        }
        stakes(where:{theseusDAO:$theseusAdd}){
          totalStaked
        }
        vamms {
          name
          loanPool {
            id
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
        }
    `;
  
  
  
    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { user: user, theseusAdd: theseusAdd };
    const data = await request(endpoint, query, variables);
  
    return data;
});