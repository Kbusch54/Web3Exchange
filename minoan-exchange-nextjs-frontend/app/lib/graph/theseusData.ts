import request, { gql } from "graphql-request";
import { cache } from 'react'

export const fetchTheseus = async function fetchData(user: string, theseusAdd: string) {
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
         insuranceFund
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
           poolPnl(orderBy: timeStamp, orderDirection: asc){
             amount
             timeStamp
             }
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
       trades{
        ffrPayed
        isActive
        ammPool{
          id
        }
        startingCost
        isActive
        created
        liquidated
        tradeOpenValues{
          tradingFee
          openCollateral
          openLoanAmt
          openValue
          openPositionSize
          openInterestRate
        }
        tradeBalance {
          side
          positionSize
          leverage
          exitPrice
          pnl
          interestRate
          LastFFRPayed
          collateral
          LastInterestPayed
          exitTime
          loanAmt
          entryPrice
          } 
       }
       balances{
         availableUsdc
       }
       }
   `;
  
  
    const endpoint = process.env.NEXT_PUBLIC_SUBGRAPH_URL||"https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest";
    const variables = { user: user, theseusAdd: theseusAdd };
    const data = await request(endpoint, query, variables);
  
    return data;
};







// trades{
  // isActive
  // startingCost
  // isActive
  // id
  // created
  // liquidated
  // ffrPayed 
// tradeOpenValues{
//   tradingFee
//   openCollateral
//   openLoanAmt
//   openValue
//   openPositionSize
//   openInterestRate
// }
  // tradeBalance {
  //   side
  //   positionSize
  //   leverage
  //   exitPrice
  //   pnl
  //   interestRate
  //   LastFFRPayed
  //   collateral
  //   LastInterestPayed
  //   exitTime
  //   loanAmt
  //   entryPrice
  //   } 
// }