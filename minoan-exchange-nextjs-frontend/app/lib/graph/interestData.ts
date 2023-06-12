import request, { gql } from "graphql-request";
// @ts-ignore
import { cache } from 'react'

export const getInterestData = cache(async(ammPoolId: string, user: string)=> {
    const query = gql` 
        query getTradeData($user: String!, $ammPoolId: String!) {
      trades(where:{
        user: $user,
        ammPool:$ammPoolId
        
      }) {
        tradeBalance {
          interestRate
          loanAmt
          LastInterestPayed
        }
        ammPool{
          interestPeriod
        }
      }
    }
     
    `;
    const endpoint = "https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { ammPoolId: ammPoolId, user: user };
    const data = await request(endpoint, query, variables);
  
    return data;
  });