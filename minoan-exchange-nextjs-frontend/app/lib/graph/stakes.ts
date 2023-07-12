import request, { gql } from "graphql-request";
import { cache } from 'react'

export const fetchStakes = cache(async function getStakes() {
    const query = gql`
  query getstakes {
    singleStakes {
      user {
        id
      }
      ammPool {
        id
      }
      theseusDAO {
        id
      }
      tokensMinted
      usdcStaked
      timeStamp
    }
    singleUnstakes {
      user {
        id
      }
      ammPool {
        id
      }
      theseusDAO {
        id
      }
      tokensBurned
      usdcUnstaked
      timeStamp
    }
    stakes{
      totalStaked
        ammPool{
          id
        }
    }
  }
`;



const endpoint = process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
const data = await request(endpoint, query);
return data;
});