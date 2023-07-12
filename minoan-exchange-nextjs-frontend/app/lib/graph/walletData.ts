import request, { gql } from "graphql-request";
import { cache } from 'react'

type WalletData = {
    users: {
        balances: {
            availableUsdc: number|null
            totalCollateralUsdc: number|null
        }
    }[]
}

export const fetchWallet = cache(async function fetchData(user: string) {
    const query = gql` 
      query getWallet($user: String!) {
        users(where:{id:$user}){
          id
          balances{
            availableUsdc
            totalCollateralUsdc
          }
        }
        
        }
    `;
    const endpoint = process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { user: user };
    const data:WalletData = await request(endpoint, query, variables);
  
    return data;
});