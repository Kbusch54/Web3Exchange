// @ts-ignore
import React,{use,Suspense} from 'react'
import DashBoardBalances from '../../components/balances/dashboard/DashBoardBalances'
import ReachartsEx from '../../components/charts/poolCharts/ReachartsEx'
import DashBoardTradeTab from '../../components/tabs/dashboard/DashBoardTradeTab'
import DashboardAssets from '../../components/tabs/dashboard/DashboardAssets'
import { Stock } from "../../types/custom";
import { stocks } from "../utils/stockData";
import { getServerSession } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import request, { gql } from 'graphql-request';
import RechartPie from '../../components/charts/poolCharts/recharts/RechartPie'

interface Props {

}
async function fetchUserData(user: string) {
    const query = gql` 
      query getAllData($user: String!) {

    trades(where:{user: $user}){
      isActive
      ammPool{
        id
        }
      startingCost
      tradeBalance{
        collateral
        pnl
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
}

export default async function page  () {
    
    const session = await getServerSession();
    if(!session) {
        redirect(`/auth/signin?callbackUrl=/dashboard`);
    }
    // const userData = await fetchUserData(session.user.name);
    return (
        <div className='mx-4 flex flex-col gap-y-4'>
            <h1 className='text-white'>Dashboard</h1>
            {/* <DashBoardBalances userData={userData}/> */}
            <div className='mx-4 md:mx-8 lg:mx-24 xl:mx-40 border-2 border-slate-700 mt-12'>
                {/* <Suspense fallback={<div>Loading...</div>}>
                </Suspense> */}
                <RechartPie />
                <ReachartsEx />
            </div>
            
                {/* <DashBoardTradeTab user={session.user.name}  />
            
            {stocks && (
                    <DashboardAssets userData={userData} stockData={stocks} user={session.user.name} />
            )} */}
        </div>
    )
}
