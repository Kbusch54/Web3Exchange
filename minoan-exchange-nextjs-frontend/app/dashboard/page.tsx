// @ts-ignore
import React, { use, Suspense } from 'react'
import DashBoardBalances from '../../components/balances/dashboard/DashBoardBalances'
import ReachartsEx from '../../components/charts/poolCharts/ReachartsEx'
import DashBoardTradeTab from '../../components/tabs/dashboard/DashBoardTradeTab'
import DashboardAssets from '../../components/tabs/dashboard/DashboardAssets'
import { Stock } from "../../types/custom";
import { stocks } from "../utils/stockData";
import { redirect } from "next/navigation";
import RechartPie from '../../components/charts/poolCharts/recharts/RechartPie'
import RechartLines from '../../components/charts/poolCharts/recharts/RechartLines'
import RechartTinyBar from '../../components/charts/poolCharts/recharts/RechartTinyBar'
import PastTransactions from '../../components/tables/transactions/PastTransactions'
import Wallet from '../../components/dashboard/Wallet'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../utils/auth/authOptions'
import { Address } from 'wagmi'
import request, { gql } from 'graphql-request'
import { getUserData } from '../lib/graph/dashboardUserData'
import PieBox from '../../components/dashboard/charts/pies/PieBox'
import TinyBar from '../../components/dashboard/charts/bar/TinyBar'


interface Props {

}


export default async function page() {

    const session = await getServerSession(authOptions)
  if(!session || !session.user){
    return redirect("/auth/signin?callbackUrl=/dashboard")
  }
    const user:Address = session.user.name as Address;
    console.log('this is user',session);
    const userData = await getUserData(user);
    // console.log('this is userdtaa',userData);

    return (
        <div className='mx-4 flex flex-col gap-y-4 '>
            <h1 className='text-white'>Dashboard</h1>
            { userData !== null &&(

                <DashBoardBalances userData={userData} />
            )}
            <div className='grid grid-cols-12'>
                <PieBox />
                <div className='col-span-12 lg:col-span-6 2xl:col-span-8 3xl:col-span-4 grid grid-cols-6 gap-x-4'>
                    <TinyBar />
                    <div className='col-span-6 2xl:col-span-4 mt-24 border border-slate-800 flex flex-col h-fit rounded-xl'>
                        <p className='text-white text-xl text-center pt-4'>Trading History</p>
                        <RechartLines height={300} />
                    </div>
                </div>
                <div className='col-span-12 3xl:col-span-4 mx-12 flex flex-col 2xl:flex-row 2xl:justify-between 3xl:flex-col  '>
                    <Wallet user={user} />
                    <PastTransactions />
                </div>
            </div>
            <DashBoardTradeTab user={user}  />
            {stocks && userData !== null && (
                <DashboardAssets userData={userData} stockData={stocks} user={user} />
                
            )}
        </div>
    )
}
